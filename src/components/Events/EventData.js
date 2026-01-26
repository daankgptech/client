// EventData.js
import { slugify } from "../../utils/slugify";

const rawEvents = [
  {
    title: "Dakshana Day '25",
    image:
      "https://res.cloudinary.com/dcwwptwzt/image/upload/v1760724539/DakshanaDay25_u2a2ba.avif",
    description:
      "This year’s Dakshana Day celebrated our 19th milestone, honoring our growth, unity, and the bright future ahead. The event reflected on Dakshana's journey, from its humble beginnings to its inspiring success. Speeches by Rinku Shakya and Routhu Amulya highlighted both our past achievements and future aspirations. We proudly introduced new CRs, Uttam Meghwal and Shivam Ahirwar, and heard encouraging words from Mr. Shani Maurya and Mr. Ashutosh. The day was filled with performances showcasing the spirit of Dakshana. Concluding with a group photo and cake-cutting, we look forward to continuing this journey of growth, inspiration, and community.",
    date: "October 15, 2025",
    driveLink: "https://drive.google.com/drive/folders/1qND-8ZxBIH5_qfnNlEb2ESJ6jY_CsKnE",
  },
  {
    title: "A Memorable Visit by Ravi Sir",
    image:
      "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747720816/Ravi_Sir_s_Visit_inndze_wjuwmw.avif",
    description:
      "We were honored to welcome Ravi Sir to our campus for a truly inspiring and memorable visit. His presence at the Gymkhana, IIT Kharagpur, brought immense joy and excitement among all of us. During his time with us, Ravi Sir interacted warmly with students, shared his experiences, and offered valuable guidance that left a lasting impact. We are deeply thankful for his visit, which motivated and encouraged us to strive for excellence.",
    date: "April 15, 2025",
    driveLink:"https://drive.google.com/drive/folders/1TcPIn6S3R4gigxpS9rtQ0rJblownoXZ4"
  },
  {
    title: "Farewell Ceremony '25",
    image:
      "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747720689/Untitled_design_1_drqdt6.avif",
    description:
      "Kudos and a heartfelt farewell to our incredible graduates who have been constant sources of inspiration throughout our journey. With their wisdom, leadership, and unwavering support, they guided us through challenges and helped us grow both personally and academically. Their presence lit our path, and their legacy will continue to inspire us long after they’ve moved on. We wish them the very best as they embark on new adventures beyond campus.",
    date: "April 06, 2025",
    driveLink: "https://drive.google.com/drive/folders/1JUGPdF1G7uThy2078Ih1UTB406tVM5pL",
  },
  {
    title: "Fresher's Treat",
    image:
      "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747721178/Fresher_s_Treat_vc4ldn.avif",
    description:
      "Cheers to our Freshers' Treat - a vibrant and heartfelt welcome that brought Fresher and Sophomers together. It was an evening filled with laughter, energy, and meaningful connections, setting the perfect tone for the journey ahead. The joy, performances, and bonding created unforgettable memories, marking a beautiful beginning for our newest members of the KGP family.",
    date: "Jan 12, 2025",
  },
  {
    title: "Dakshana Day '24",
    image:
      "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747721130/Dakshana_Day_iwamns.avif",
    description:
      "A special occasion where we celebrated the remarkable journey and successful completion of 18 years of the Dakshana Foundation. It was a day of gratitude and reflection, honoring our organization that has transformed countless lives through education and unwavering support. Dakshana has given us knowledge, values, and opportunities, shaping us into who we are today. Its impact is profound, and its legacy continues to inspire future generations.",
    date: "October 15, 2024",
    driveLink:"https://drive.google.com/drive/folders/1So_SdNv7LnJf_X1XaMH6-2psE891G6U3"
  },
];

const EventData = Object.freeze(
  rawEvents.map((event, id) => ({
    id,
    slug: slugify(event.title),
    ...event,
  }))
);

export default EventData;
