import Image from "next/image";
import MainContent from "@/components/main";
import Feature from "@/components/feature";
import Works from "@/components/works"
import Testimonial from "@/components/testimonial";
import CTA from "@/components/cta"
import Footer from "@/components/footer"
export default function Home() {
  return (
    <main className="flex-1">
    
     {/* main */}
     <MainContent/>
     {/* feature */}
     <Feature/>
     {/* works */}
     <Works/>
     {/* testimonial */}
     <Testimonial/>
     {/* CTA Section*/}
     <CTA />
     {/* Footer */}
     <Footer/>
    </main>
  );
}
