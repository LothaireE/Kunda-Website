import type { StaticImageData } from "next/image";
import stack01 from "@/assets/images/landing/stack-01.jpeg";
import stack02 from "@/assets/images/landing/stack-02.jpeg";
import stack03 from "@/assets/images/landing/stack-03.jpeg";
import stack04 from "@/assets/images/landing/stack-04.jpeg";
import stack05 from "@/assets/images/landing/stack-05.jpeg";
import stack06 from "@/assets/images/landing/stack-06.jpeg";
import stack07 from "@/assets/images/landing/stack-07.jpeg";
import stack08 from "@/assets/images/landing/stack-08.jpeg";
import stack09 from "@/assets/images/landing/stack-09.jpeg";
import stack10 from "@/assets/images/landing/stack-10.jpeg";
import stack11 from "@/assets/images/landing/stack-11.jpeg";
import stack12 from "@/assets/images/landing/stack-12.jpeg";

type StackImage = {
  src: StaticImageData;
  alt: string;
  left: string;
  top: string;
  mobileLeft: string;
  mobileTop: string;
};

export const ImageStackContent: StackImage[] = [
  {
    src: stack01,
    alt: "Bac de vaisselle colorée sur un marché",
    left: "15%",
    top: "24%",
    mobileLeft: "18%",
    mobileTop: "18%",
  },
  {
    src: stack02,
    alt: "Portrait dans un marché",
    left: "38%",
    top: "42%",
    mobileLeft: "68%",
    mobileTop: "28%",
  },
  {
    src: stack03,
    alt: "Scène de rue devant un salon",
    left: "76%",
    top: "20%",
    mobileLeft: "30%",
    mobileTop: "42%",
  },
  {
    src: stack04,
    alt: "Artistes se préparant devant des miroirs",
    left: "23%",
    top: "76%",
    mobileLeft: "78%",
    mobileTop: "52%",
  },
  {
    src: stack05,
    alt: "Table de rue et circulation urbaine",
    left: "82%",
    top: "73%",
    mobileLeft: "20%",
    mobileTop: "67%",
  },
  {
    src: stack06,
    alt: "Vendeuse sur un marché",
    left: "55%",
    top: "62%",
    mobileLeft: "67%",
    mobileTop: "78%",
  },
  {
    src: stack07,
    alt: "Tabourets et table de rue",
    left: "8%",
    top: "52%",
    mobileLeft: "83%",
    mobileTop: "16%",
  },
  {
    src: stack08,
    alt: "Femmes assises dans la salle de prière de la mosquée Putra",
    left: "91%",
    top: "45%",
    mobileLeft: "14%",
    mobileTop: "34%",
  },
  {
    src: stack09,
    alt: "Vendeur de marrons sur un marché",
    left: "65%",
    top: "84%",
    mobileLeft: "82%",
    mobileTop: "66%",
  },
  {
    src: stack10,
    alt: "Cliente sur un marché de nuit",
    left: "42%",
    top: "14%",
    mobileLeft: "50%",
    mobileTop: "14%",
  },
  {
    src: stack11,
    alt: "Deux hommes jouant au Xiangqi sur le trottoir",
    left: "63%",
    top: "40%",
    mobileLeft: "45%",
    mobileTop: "54%",
  },
  {
    src: stack12,
    alt: "Cliente au stand de piments sur un marché",
    left: "38%",
    top: "72%",
    mobileLeft: "42%",
    mobileTop: "84%",
  },
];
