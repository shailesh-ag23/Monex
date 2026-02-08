import Hero from "@/components/Hero";
import { featuresData, howItWorksData } from "@/data/landing";
import { Card,CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import  Link  from "next/link";

export default function Home() {
  return (
    <div className="mt-30 mx-auto" >
      <Hero/>
      
      <section className="py-20 bg-orange-400">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Everything you need to manage your finance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature,index)=>(
              <Card key={index} className="p-6">
                <CardContent className="space-y-4 pt-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
               </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black/8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">{step.icon}</div>
                <div className="text-xl font-semibold mb-4">{step.title}</div>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-orange-400">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to take control of your Finances?</h2>
          <p className="text-white mt-8 max-w-2xl mx-auto">Join the users who are already managing their finances smarter with Monex</p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-black mt-10 hover:bg-black/90 hover:text-white animate-bounce">Start Free Trial</Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
