"use client";

import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface OAuth2ProviderButtonProps {
    provider: "naver";
    imageSrc: string;
    alt: string;
}

export default function OAuth2ProviderButton({
                                                provider,
                                                imageSrc,
                                                alt,
}: OAuth2ProviderButtonProps) {
    const handleLogin = async () => {
        window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
    };

    return (
        <button
            onClick={handleLogin}
            className="flex justify-center"
        >
            <Image
                src={imageSrc}
                alt={alt}
                width={230}
                height={48}
                priority
            />
        </button>
    );
}