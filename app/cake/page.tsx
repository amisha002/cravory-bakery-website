import Image from "next/image"

export default function CakePage({
    searchParams,
}: {
    searchParams: { image?: string; caption?: string }
}) {
    const image = searchParams.image
    const caption = searchParams.caption

    if (!image) {
        return (
            <div style={{ padding: 40, textAlign: "center" }}>
                <h1>Cake not found</h1>
            </div>
        )
    }

    return (
        <div style={{ padding: 20, textAlign: "center" }}>
            <h1>{caption || "Cravory Cake"}</h1>

            <Image
                src={image}
                alt={caption || "Cake"}
                width={600}
                height={600}
                style={{ margin: "20px auto", borderRadius: 12 }}
            />
        </div>
    )
}
