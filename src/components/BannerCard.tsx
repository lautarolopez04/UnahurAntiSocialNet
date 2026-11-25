import logoUnahurLogin from '../assets/logoUnahurLogin.png';

export function BannerCard() {
    return (
        <div className="col-12 col-lg-6 text-center text-lg-start pe-lg-4 animar-entrada">
            <h1 className="fw-bold mb-2 titulo-gradiente" style={{ fontSize: '2.25rem' }}>
                UnaHur Anti-Social Net
            </h1>
            <p className="text-secondary mb-4 mx-auto mx-lg-0" style={{ maxWidth: '420px' }}>
                Conectá con la comunidad UNAHUR y compartí tus publicaciones.
            </p>
            <img
                src={logoUnahurLogin}
                alt="Notebook conectada a la red social"
                className="img-fluid rounded-2 mt-1 d-none d-lg-block imagen-flotante"
                style={{ maxWidth: '390px', width: '100%' }}
            />
        </div>
    );
};


