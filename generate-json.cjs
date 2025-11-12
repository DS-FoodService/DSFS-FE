const fs = require("fs");
const path = require("path");

const IMAGES_DIR = path.join(__dirname, "public/assets/restaurants");

function getImages(dir, array = []) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      getImages(fullPath, array);
    } else {
      const parsed = path.parse(fullPath);
      array.push({
        id: parsed.name,
        name: parsed.name,
        // ✅ 경로 수정 (restaurants 폴더까지 포함)
        src: `/assets/restaurants/${parsed.base}`,
      });
    }
  });
  return array;
}

const imageList = getImages(IMAGES_DIR);

const outputFilePath = path.join(__dirname, "src/data/images.js");

fs.writeFileSync(
  outputFilePath,
  `// 자동 생성된 파일. 절대 수정하지 마세요.\nexport const images = ${JSON.stringify(
    imageList,
    null,
    2
  )};\n`
);

console.log("✅ 이미지 JSON 생성 완료:", outputFilePath);
