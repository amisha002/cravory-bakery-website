import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Sparkles, Users, Award, Cake, Cookie, IceCream } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/5 rounded-full animate-float-delay" />
        <div className="absolute bottom-40 left-1/4 w-28 h-28 bg-accent/5 rounded-full animate-float-slow" />
        <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-[#B5EAD7]/5 rounded-full animate-float" />
      </div>

      <div className="py-12 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 animate-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">About CRAVORY</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our story of bringing eggless joy to every celebration
            </p>
          </div>
        </div>
      </div>

      <div className="absolute left-10 top-[40%] hidden lg:block animate-float">
        <Cake className="w-16 h-16 text-primary/20" />
      </div>
      <div className="absolute right-10 top-[50%] hidden lg:block animate-float-delay">
        <Cookie className="w-20 h-20 text-secondary/20" />
      </div>
      <div className="absolute left-20 top-[70%] hidden lg:block animate-float-slow">
        <IceCream className="w-14 h-14 text-accent/20" />
      </div>

      <div className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg mx-auto mb-16">
            <Card className="p-8 hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
              <CardContent className="space-y-6 p-0">
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-balance">Our Story</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    CRAVORY was born from a simple belief: everyone deserves to enjoy delicious desserts, regardless of
                    dietary preferences. Founded by <span className="font-semibold text-primary">Aishwarya</span>, what
                    started as a passion for baking has grown into a beloved bakery that specializes in creating
                    exceptional eggless treats. Every creation is <span className="italic">baked with love</span> to
                    bring joy to your special moments.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-balance">Our Philosophy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We believe that eggless doesn't mean compromising on taste or quality. Every dessert we create is
                    crafted with premium ingredients and lots of love. From our signature cakes to our handmade
                    chocolates, each item is made fresh to order, ensuring you get the best possible experience.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-4 text-balance">What Makes Us Special</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our commitment to quality and customer satisfaction sets us apart. We offer complete customization
                    for your special occasions, use only the finest ingredients, and bake everything fresh. Whether it's
                    a birthday, anniversary, or just because, CRAVORY is here to make your moments sweeter.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className="hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="bg-primary/10 text-primary p-4 rounded-full hover:rotate-12 transition-transform duration-300">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">Made with Love</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every dessert is handcrafted with care and attention to detail
                </p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="bg-secondary/10 text-secondary p-4 rounded-full hover:rotate-12 transition-transform duration-300">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">Premium Quality</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use only the finest ingredients for exceptional taste
                </p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="bg-accent/10 text-accent p-4 rounded-full hover:rotate-12 transition-transform duration-300">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">Customer First</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your satisfaction and happiness are our top priorities
                </p>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="bg-[#B5EAD7]/20 text-[#B5EAD7] p-4 rounded-full hover:rotate-12 transition-transform duration-300">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">Always Fresh</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Everything is made fresh to order for the best experience
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
