import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Custom Cake Reference | CRAVORY",
    description: "Reference image for customized cake order at CRAVORY",
    openGraph: {
        title: "Custom Cake Reference | CRAVORY",
        description: "Reference image for customized cake",
        images: [
            {
                url: "https://cravory-bakery.vercel.app/og-placeholder.jpg",
                width: 1200,
                height: 630,
            },
        ],
    },
}

type Props = {
    searchParams: {
        img?: string
    }
}

export default function PreviewPage({ searchParams }: Props) {
    const imageUrl = searchParams?.img

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#fffaf5",
                padding: 24,
            }}
        >
            {imageUrl ? (
                <img
                    src={decodeURIComponent(imageUrl)}
                    alt="Custom cake reference"
                    style={{
                        maxWidth: "100%",
                        maxHeight: "90vh",
                        borderRadius: 16,
                        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    }}
                />
            ) : (
                <p>No image provided</p>
            )}
        </div>
    )
}
