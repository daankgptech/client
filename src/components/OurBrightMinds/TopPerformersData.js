const baseData = {
  2021: [
    { id: 0, img: "", name: "...", dept: "...", cg: "9.99" },
    { id: 1, img: "", name: "...", dept: "...", cg: "9.99" },
    { id: 2, img: "", name: "...", dept: "...", cg: "9.99" },
  ],
  2022: [
    { id: 0, img: "", name: "...", dept: "...", cg: "9.99" },
    { id: 1, img: "", name: "...", dept: "...", cg: "9.99" },
    { id: 2, img: "", name: "...", dept: "...", cg: "9.99" },
  ],
  2023: [
    { id: 0, img: "https://res.cloudinary.com/dcwwptwzt/image/upload/v1759170074/ashutoshRanjan_e8ddls.avif", name: "Mr. Ashutosh Ranjan", dept: "ME", cg: "9.19" },
    { id: 1, img: "https://res.cloudinary.com/dcwwptwzt/image/upload/v1748288503/Om_Dabhade_z0sxjw_b6dacp.avif", name: "Mr. Om Dabhade", dept: "IE", cg: "8.50" },
    { id: 2, img: "https://res.cloudinary.com/dcwwptwzt/image/upload/v1748288650/Sunny_lzoth5_x3clbm.avif", name: "Mr. Sunny", dept: "IE", cg: "8.40" },
  ],
  2024: [
    { id: 0, img: "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747753968/Sachin_Kumar_mppltl_yffpix.avif", name: "Mr. Sachin Kumar", dept: "CS", cg: "9.52" },
    { id: 1, img: "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747753949/Pratik_Verma_nirhu7_uorhgb.avif", name: "Mr. Pratik Verma", dept: "CS", cg: "9.07" },
    { id: 2, img: "https://res.cloudinary.com/dcwwptwzt/image/upload/v1747753945/Nayan_Balpande_fagifz_kbshxp.avif", name: "Mr. Nayan Balpande", dept: "IM", cg: "8.68" },
  ],
};

// Map positions to colours
const colour = [
  "linear-gradient(to right, #FBBF24, #F97316)", // 1st: yellow → orange
  "linear-gradient(to right, #60A5FA, #4F46E5)", // 2nd: blue → indigo
  "linear-gradient(to right, #EC4899, #8B5CF6)", // 3rd: pink → purple
];


const TopPerformersData = Object.fromEntries(
  Object.entries(baseData).map(([year, students]) => [
    year,
    students.map((student, index) => ({
      ...student,
      position: index < 3 ? String(index + 1) : undefined,
      colour: index < 3 ? colour[index] : undefined,
    })),
  ])
);

export default TopPerformersData;
