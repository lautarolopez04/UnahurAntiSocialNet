import { useState } from 'react';

interface AvatarProps {
  nickName: string;
  tamano?: number;
}

export function Avatar({ nickName, tamano = 40 }: AvatarProps) {
  const [fallo, setFallo] = useState<boolean>(false);

  if (fallo) {
    return (
      <div
        className="avatar-mini d-flex align-items-center justify-content-center rounded-circle fw-bold flex-shrink-0"
        style={{ width: tamano, height: tamano, fontSize: tamano / 2.5 }}
        aria-hidden="true"
      >
        {nickName.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(nickName)}`}
      alt={`Foto de perfil de ${nickName}`}
      className="avatar-mini rounded-circle flex-shrink-0"
      width={tamano}
      height={tamano}
      onError={() => setFallo(true)}
    />
  );
}
