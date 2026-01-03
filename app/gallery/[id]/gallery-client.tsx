"use client"

export default function GalleryClient({ image }: any) {
    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <img src={image.image_url} className="rounded-xl mb-6" />
            <h1 className="text-2xl font-bold">{image.caption}</h1>
            <p className="mb-6">{image.category}</p>

            <a
                href={`https://wa.me/918420174756?text=${encodeURIComponent(
                    `Hi CRAVORY 👋\n\nCategory: ${image.category}\nDescription: ${image.caption}\n\nView cake:\nhttps://cravory-bakery.vercel.app/gallery/${image.id}`
                )}`}
                target="_blank"
                className="bg-primary text-white px-6 py-3 rounded-md inline-block"
            >
                Order on WhatsApp
            </a>
        </main>
    )
}
