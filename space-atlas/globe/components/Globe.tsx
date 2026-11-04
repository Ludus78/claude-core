"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { json2satrec, type OMMJsonObject, type SatRec } from "satellite.js";
import { scenePosition } from "../lib/projection";
import { GROUPS, type GroupId } from "../server/groups";

type GroupResponse = { group: GroupId; fetchedAt: number; stale: boolean; records: OMMJsonObject[] };

type Layer = {
  id: GroupId;
  satrecs: SatRec[];
  positions: Float32Array;
  points: THREE.Points;
};

const SPEEDS = [1, 60, 600];

function graticule(): THREE.LineSegments {
  const points: number[] = [];
  const step = Math.PI / 12;
  const segments = 96;
  const push = (lat: number, lon: number) =>
    points.push(Math.cos(lat) * Math.cos(lon), Math.sin(lat), -Math.cos(lat) * Math.sin(lon));

  for (let lat = -Math.PI / 2 + step; lat < Math.PI / 2 - 1e-6; lat += step) {
    for (let i = 0; i < segments; i++) {
      push(lat, (i / segments) * Math.PI * 2);
      push(lat, ((i + 1) / segments) * Math.PI * 2);
    }
  }
  for (let lon = 0; lon < Math.PI * 2 - 1e-6; lon += step) {
    for (let i = 0; i < segments / 2; i++) {
      push(-Math.PI / 2 + (i / (segments / 2)) * Math.PI, lon);
      push(-Math.PI / 2 + ((i + 1) / (segments / 2)) * Math.PI, lon);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  return new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({ color: 0x24406b, transparent: true, opacity: 0.55 }),
  );
}

export default function Globe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(SPEEDS[1]);
  const [speed, setSpeed] = useState(SPEEDS[1]);
  const [message, setMessage] = useState<string | null>("Chargement des orbites…");
  const [counts, setCounts] = useState<Partial<Record<GroupId, number>>>({});

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.01, 100);
    camera.position.set(2.6, 1.4, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 1.4;
    controls.maxDistance = 12;
    controls.enableDamping = true;

    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), new THREE.MeshBasicMaterial({ color: 0x0a1424 }));
    scene.add(earth, graticule());

    const layers: Layer[] = [];
    let cancelled = false;
    let frame = 0;

    async function loadGroup(id: GroupId): Promise<string | null> {
      const response = await fetch(`/api/orbits/${id}`);
      if (!response.ok) return `Orbites « ${id} » indisponibles pour le moment.`;
      const data = (await response.json()) as GroupResponse;
      if (cancelled) return null;

      const satrecs: SatRec[] = [];
      for (const record of data.records) {
        try {
          satrecs.push(json2satrec(record));
        } catch {
          // skip a record that SGP4 cannot initialise
        }
      }
      const positions = new Float32Array(satrecs.length * 3);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: GROUPS[id].color,
        size: id === "stations" ? 0.035 : 0.018,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      scene.add(points);
      layers.push({ id, satrecs, positions, points });
      setCounts((previous) => ({ ...previous, [id]: satrecs.length }));
      return data.stale ? "Données orbitales gardées en mémoire (CelesTrak injoignable)." : null;
    }

    Promise.all(
      (Object.keys(GROUPS) as GroupId[]).map((id) =>
        loadGroup(id).catch(() => `Orbites « ${id} » indisponibles pour le moment.`),
      ),
    ).then((notes) => {
      if (!cancelled) setMessage(notes.find(Boolean) ?? null);
    });

    const clock = new THREE.Clock();
    let simulated = Date.now();

    function render() {
      frame = requestAnimationFrame(render);
      simulated += clock.getDelta() * 1000 * speedRef.current;
      const date = new Date(simulated);
      for (const layer of layers) {
        layer.satrecs.forEach((satrec, index) => {
          const position = scenePosition(satrec, date);
          // Objects SGP4 cannot place (decayed, bad elements) are parked inside the Earth.
          layer.positions.set(position ?? [0, 0, 0], index * 3);
        });
        layer.points.geometry.attributes.position.needsUpdate = true;
      }
      controls.update();
      renderer.render(scene, camera);
    }
    render();

    function onResize() {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.LineSegments) {
          object.geometry.dispose();
          (object.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const panel: React.CSSProperties = {
    position: "absolute",
    background: "rgba(5,7,13,0.78)",
    border: "1px solid #1d2a44",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 14,
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        ref={mountRef}
        style={{ position: "absolute", inset: 0 }}
        aria-label="Globe 3D des orbites de satellites"
        role="img"
      />

      <div style={{ ...panel, top: 12, left: 12 }}>
        <strong style={{ fontSize: 16 }}>Où sont les satellites ?</strong>
        <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0 }}>
          {(Object.keys(GROUPS) as GroupId[]).map((id) => (
            <li key={id} style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 24 }}>
              <span aria-hidden style={{ width: 10, height: 10, borderRadius: "50%", background: GROUPS[id].color }} />
              {GROUPS[id].label}
              {counts[id] !== undefined && <span style={{ color: "#8fa0c0" }}>({counts[id]})</span>}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ ...panel, top: 12, right: 12, display: "flex", gap: 8, alignItems: "center" }}>
        <span>Vitesse</span>
        {SPEEDS.map((value) => (
          <button
            key={value}
            onClick={() => setSpeed(value)}
            aria-pressed={speed === value}
            style={{
              minHeight: 44,
              minWidth: 44,
              borderRadius: 6,
              border: "1px solid #1d2a44",
              background: speed === value ? "#24406b" : "transparent",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            ×{value}
          </button>
        ))}
      </div>

      {message && (
        <div role="status" style={{ ...panel, bottom: 48, left: 12 }}>
          {message}
        </div>
      )}

      <div style={{ position: "absolute", bottom: 12, left: 12, fontSize: 12, color: "#8fa0c0" }}>
        Données orbitales : CelesTrak. Positions calculées avec SGP4 (satellite.js). Prototype, sans fond de carte. À vitesse élevée, la précision des positions se dégrade loin de la date des données (à vérifier à la source).
      </div>
    </div>
  );
}
