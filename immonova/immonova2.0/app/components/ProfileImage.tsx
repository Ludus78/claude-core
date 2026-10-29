import Image from 'next/image';

export default function ProfileImage() {
  return (
    <div className="relative w-[200px] h-[200px]">
      <Image
        src="/images/profile.jpg"
        alt="Ludovic DENIS - Expert immobilier"
        fill
        sizes="200px"
        className="object-cover rounded-lg shadow-md"
        priority
      />
    </div>
  );
} 