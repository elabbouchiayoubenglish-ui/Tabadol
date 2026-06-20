const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

console.log("⏳ جاري قراءة ملفات الإكسل ومعالجة المؤسسات، قد يستغرق الأمر ثوانٍ قليلة...");

const database = {};

const filesMap = {
  primary: 'etab-ensprimaire-public-men-2.xls',
  middle: 'etab-ensseccollegial-public.xls',
  high: 'etab-enssecqualifiant-public-men.xls'
};

for (const [level, fileName] of Object.entries(filesMap)) {
  const filePath = path.join(process.cwd(), fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ تحذير: ملف السلك (${level}) غير موجود باسم: ${fileName}`);
    continue;
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  for (const row of data) {
    const regionKey = Object.keys(row).find(k => k.startsWith('REG') || k.startsWith('REGIN'));
    const provinceKey = Object.keys(row).find(k => k.startsWith('PROV'));
    const schoolKey = Object.keys(row).find(k => k.startsWith('NOM_ETAB'));
    // خريطة التحويل الرسمية
    let region = String(row[regionKey]).trim();
    const province = String(row[provinceKey]).trim();
    const school = String(row[schoolKey]).trim();

    // خريطة تحويل أسماء الجهات
    const regionMap = {
        'Tanger - Tetouan': 'طنجة-تطوان-الحسيمة',
        'l\'Oriental': 'الشرق',
        'Fès - Boulmane': 'فاس-مكناس',
        'Taza - Al Hoceima - Taounate': 'فاس-مكناس',
        'Rabat - Salé - Zemmour - Zaer': 'الرباط-سلا-القنيطرة',
        'Gharb - Chrarda - Beni Hssen': 'الرباط-سلا-القنيطرة',
        'Tadla - Azilal': 'بني ملال-خنيفرة',
        'Grand Casablanca': 'الدار البيضاء-سطات',
        'Chaouia - Ourdigha': 'الدار البيضاء-سطات',
        'Marrakech - Tensift - Al Haouz': 'مراكش-آسفي',
        'Doukala - Abda': 'مراكش-آسفي',
        'Meknès - Tafilalet': 'درعة-تافيلالت',
        'Sous-Massa-Draa': 'سوس-ماسة',
        'Guelmim - Es-smara': 'كلميم-واد نون',
        'Laayoune-Boujdour-Sakia Al Hamra': 'العيون-الساقية الحمراء',
        'Oued Ed-dahab - Lagouira': 'الداخلة-وادي الذهب'
    };

    if (regionMap[region]) region = regionMap[region];
    if (province === 'Es-smara' || province === 'السمارة') region = 'العيون-الساقية الحمراء';

    if (!region || !province || !school || region === 'undefined') continue;

    if (!database[region]) {      database[region] = {};
    }

    if (!database[region][province]) {
      database[region][province] = {
        primary: [],
        middle: [],
        high: []
      };
    }

    if (!database[region][province][level].includes(school)) {
      database[region][province][level].push(school);
    }
  }
}

const dirPath = path.join(process.cwd(), 'app', 'create-request');
if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath, { recursive: true });
}

const outputPath = path.join(dirPath, 'schools_data.json');
fs.writeFileSync(outputPath, JSON.stringify(database, null, 2), 'utf-8');

console.log(`✅ تم بنجاح استخراج البيانات وحفظها في: ${outputPath}`);
