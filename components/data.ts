export type Status = 'available' | 'reserved' | 'sold';

export type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  status: Status;
  image: string;
  images: string[];
  description: string;
  featured?: boolean;
  isPublic?: boolean;
};

// Fallback snapshot of actual products (used if SQLite connection is interrupted)
export const products: Product[] = [
  {
    "id": "amazon-echo-dot-5ta-generacion-alexa",
    "title": "Amazon Echo Dot 5ta generación (Alexa)",
    "category": "Casa",
    "price": 80000,
    "status": "sold",
    "image": "/api/images/96999c3d-d991-4092-8294-d8d6ccc6dc29",
    "images": [
      "/api/images/96999c3d-d991-4092-8294-d8d6ccc6dc29",
      "/api/images/f02a0a3b-8d23-4fb2-bd04-8186e28b6881"
    ],
    "description": "Asistente inteligente por voz con Alexa, Altavoz, sirve también como parlante Bluetooth , excelente sonido y bajo. Smart home.",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "amazon-echo-flex",
    "title": "Amazon Echo Flex",
    "category": "Casa",
    "price": 35000,
    "status": "available",
    "image": "/api/images/723ca2d8-9134-41c7-81da-615bda83f534",
    "images": [
      "/api/images/723ca2d8-9134-41c7-81da-615bda83f534",
      "/api/images/13bbf9cc-7c53-4c19-b064-e71189b7ae8c",
      "/api/images/c3aec7ce-6c3c-4376-9842-0c4181d8a8ac",
      "/api/images/a673e4e2-fb03-4ef3-a31b-83574a99e89e",
      "/api/images/11b6370e-18ca-4a2c-b30c-ac752cc77df3"
    ],
    "description": "El altavoz inteligente enchufable Amazon Echo Flex con Alexa en blanco es un altavoz inteligente versátil diseñado por Amazon. Cuenta con configuración del sistema Alexa y compatibilidad con el hogar inteligente, lo que permite una integración perfecta en la configuración de tu hogar inteligente. Con conectividad Bluetooth y entradas de audio a través de USB, este altavoz inteligente ofrece opciones de conectividad versátiles. Su diseño compacto y función enchufable facilitan la configuración en cualquier habitación, mientras que su asistente de voz Alexa permite el control manos libres de tus dispositivos domésticos inteligentes. Ideal para compatibilidad universal, este altavoz inteligente es una adición conveniente y eficiente a cualquier hogar.",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "mando-control-8bitdo-ultimate-2c-inalambrico",
    "title": "Mando Control 8BitDo Ultimate 2C inalámbrico",
    "category": "Casa",
    "price": 70000,
    "status": "sold",
    "image": "/api/images/23b279a3-d8f8-4404-9e9e-e7a8f42af181",
    "images": [
      "/api/images/23b279a3-d8f8-4404-9e9e-e7a8f42af181",
      "/api/images/2412d012-44fa-4381-900c-ec59e0b0baa6",
      "/api/images/c05889a1-55f4-49f6-b8ba-4e509fd1cac3"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "balanza-digital-con-bowl-3kg-bluesky",
    "title": "Balanza Digital con Bowl 3kg Bluesky",
    "category": "Casa",
    "price": 10000,
    "status": "available",
    "image": "/api/images/c0db99cd-d2ee-40cc-9471-50b13d0fb655",
    "images": [
      "/api/images/c0db99cd-d2ee-40cc-9471-50b13d0fb655",
      "/api/images/15f797be-d9a3-42ba-bab1-34cc51d0f181"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "taladro-percutor-skil-6644-2-mechas-tramontina-6-8-mm",
    "title": "Taladro Percutor Skil 6644 + 2 mechas Tramontina 6-8 mm",
    "category": "Casa",
    "price": 40000,
    "status": "available",
    "image": "/api/images/d163bd37-23ab-4c5b-b937-e075fb9ca484",
    "images": [
      "/api/images/d163bd37-23ab-4c5b-b937-e075fb9ca484",
      "/api/images/f0baf98d-abc6-430c-b804-818f95a82929"
    ],
    "description": "2 mechas Tramontina acero 6 y 8 mm",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "separador-de-ambiente-cajonera-placard",
    "title": "Separador de Ambiente + Cajonera + Placard",
    "category": "Casa",
    "price": 120000,
    "status": "reserved",
    "image": "/api/images/0c4b1da7-93af-4acc-a520-3abdfe001d23",
    "images": [
      "/api/images/0c4b1da7-93af-4acc-a520-3abdfe001d23"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "colchon-sommier-piero-mattina-140x190",
    "title": "Colchón + Sommier Piero Mattina 140x190",
    "category": "Casa",
    "price": 700000,
    "status": "reserved",
    "image": "/api/images/d4a25884-f6ba-4d59-8d57-6896b142c5a8",
    "images": [
      "/api/images/d4a25884-f6ba-4d59-8d57-6896b142c5a8",
      "/api/images/97120dc4-5e92-485d-8211-5a63d711c615",
      "/api/images/ff3ba04c-a5aa-488f-958b-1facb278364d",
      "/api/images/07f8409e-453a-406a-bf99-079563fe8bdc"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "procesador-de-alimentos-mandine-vidrio",
    "title": "Procesador de alimentos Mandine Vidrio",
    "category": "Casa",
    "price": 25000,
    "status": "sold",
    "image": "/api/images/0554160d-4be0-475e-a3de-a45d2b560511",
    "images": [
      "/api/images/0554160d-4be0-475e-a3de-a45d2b560511",
      "/api/images/ca0e6fa9-0792-43f2-83b6-992efffc102e"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "aire-acondicionado-portatil-tophouse-12000-btu-frio-calor",
    "title": "Aire Acondicionado Portatil TopHouse 12000 BTU Frio Calor",
    "category": "Casa",
    "price": 180000,
    "status": "sold",
    "image": "/api/images/7132b883-c916-405f-a67d-2e4c9b08d56c",
    "images": [
      "/api/images/7132b883-c916-405f-a67d-2e4c9b08d56c",
      "/api/images/f79f3444-a027-49ea-8a51-19e7f4518e71",
      "/api/images/5013f1c4-458c-4500-98c6-7afa6ba6a97a"
    ],
    "description": "Incluye control remoto. Funciona perfecto.\nLe falta accesorio para conectar la manguera y la manguera está doblada en la conexión.",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "mueble-organizador-bano",
    "title": "Mueble Organizador Baño",
    "category": "Casa",
    "price": 15000,
    "status": "sold",
    "image": "/api/images/073bc854-6798-4312-996b-8348ddca5621",
    "images": [
      "/api/images/073bc854-6798-4312-996b-8348ddca5621",
      "/api/images/b6f6591e-b60c-45d7-9783-223c485c08ec",
      "/api/images/44fdcf6d-b2f1-49f7-bce5-16215a6c9068",
      "/api/images/a225b46e-4a64-480a-975c-1cc1b4696966"
    ],
    "description": "Algunos detalles pequeños de oxido ",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "playstation-4-slim-2-joystick-4-juegos-gta-v-fifa-20",
    "title": "Playstation 4 Slim - 2 Joystick - 4 Juegos - GTA V - FIFA 20",
    "category": "Casa",
    "price": 350000,
    "status": "available",
    "image": "/api/images/40f9fe7a-49d9-4966-9739-0c5fb243a62b",
    "images": [
      "/api/images/40f9fe7a-49d9-4966-9739-0c5fb243a62b",
      "/api/images/f01cd680-d18d-4942-a344-8ffda69e1690"
    ],
    "description": "Playstation 4 Slim\n\nPoco uso, excelente estado.\n\n🔹 Incluye:\n • 2 controles originales\n • Cable de carga\n • Consola PS4\n\n🔹 4 juegos:\n\n • GTA V - Premium Edition\n • FIFA 20\n • PES 2018\n • The Show 20 (Béisbol)",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "aspiradora-portatil-yelmo",
    "title": "Aspiradora Portátil Yelmo",
    "category": "Casa",
    "price": 25000,
    "status": "sold",
    "image": "/api/images/d3e0614b-df30-467d-874a-c8813181cc59",
    "images": [
      "/api/images/d3e0614b-df30-467d-874a-c8813181cc59",
      "/api/images/841a12c8-12a2-4cd6-ab53-69da023c2d90",
      "/api/images/4c47892e-22cd-44c7-99c4-f77da18a349d",
      "/api/images/a3274f30-037b-4222-bdca-43e69db3924e"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "pava-electrica",
    "title": "Pava Eléctrica",
    "category": "Casa",
    "price": 10000,
    "status": "sold",
    "image": "/api/images/fd70a0eb-8fcd-407d-866b-9432a1c18883",
    "images": [
      "/api/images/fd70a0eb-8fcd-407d-866b-9432a1c18883"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "vaso-800-ml-bowl-200-ml-apilables-tupperware-mahalo-libre-de-bpa",
    "title": "Vaso 800 ml + Bowl 200 ml apilables Tupperware Mahalo Libre de BPA",
    "category": "Casa",
    "price": 15000,
    "status": "available",
    "image": "/api/images/f6d84261-2f7d-42b1-b3e7-6ea8f5db4429",
    "images": [
      "/api/images/f6d84261-2f7d-42b1-b3e7-6ea8f5db4429"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "set-de-botellas-plastico-y-termico",
    "title": "Set de Botellas (Plástico y Térmico)",
    "category": "Casa",
    "price": 12000,
    "status": "sold",
    "image": "/api/images/dfbca317-fea2-4a80-815d-b5aea4cb9e4a",
    "images": [
      "/api/images/dfbca317-fea2-4a80-815d-b5aea4cb9e4a"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "quesillera",
    "title": "Quesillera",
    "category": "Casa",
    "price": 10000,
    "status": "sold",
    "image": "/api/images/ac69edb8-c574-41c8-a3e8-a6c1f292ee72",
    "images": [
      "/api/images/ac69edb8-c574-41c8-a3e8-a6c1f292ee72"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "set-moldes-aluminio-y-tarta-silicona",
    "title": "Set Moldes Aluminio y Tarta Silicona",
    "category": "Casa",
    "price": 8000,
    "status": "sold",
    "image": "/api/images/48ecb77e-316f-40a4-8604-63495c34a833",
    "images": [
      "/api/images/48ecb77e-316f-40a4-8604-63495c34a833"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "contenedor-rectangular-con-tapa-25x30x15",
    "title": "Contenedor Rectangular con Tapa (25x30x15)",
    "category": "Casa",
    "price": 5000,
    "status": "sold",
    "image": "/api/images/4e1f14c8-8108-4914-9a73-58597edaba33",
    "images": [
      "/api/images/4e1f14c8-8108-4914-9a73-58597edaba33"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "secador-de-pelo-studio-9-plegable",
    "title": "Secador de Pelo Studio 9 plegable",
    "category": "Casa",
    "price": 25000,
    "status": "sold",
    "image": "/api/images/ca084326-b6c3-459b-ac04-c21cd6cad721",
    "images": [
      "/api/images/ca084326-b6c3-459b-ac04-c21cd6cad721"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "centrifugador-escurridor-de-vegetales-2-pinzas-de-silicona",
    "title": "Centrifugador Escurridor de Vegetales + 2 Pinzas de Silicona",
    "category": "Casa",
    "price": 10000,
    "status": "sold",
    "image": "/api/images/de9e157e-514a-4d23-bd53-abb8857bdc18",
    "images": [
      "/api/images/de9e157e-514a-4d23-bd53-abb8857bdc18"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "cepillo-alisador-gama-ceramic-ion",
    "title": "Cepillo Alisador Gama Ceramic Ion",
    "category": "Casa",
    "price": 60000,
    "status": "sold",
    "image": "/api/images/5d8a4f59-6859-40c7-92a4-429adda2b5ac",
    "images": [
      "/api/images/5d8a4f59-6859-40c7-92a4-429adda2b5ac"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "lampara-ventilador-techo-luz-led-aspas-retractiles",
    "title": "Lámpara Ventilador Techo Luz LED Aspas retráctiles",
    "category": "Casa",
    "price": 100000,
    "status": "sold",
    "image": "/api/images/426af8d3-d88f-477d-9db9-5b62a23e8163",
    "images": [
      "/api/images/426af8d3-d88f-477d-9db9-5b62a23e8163",
      "/api/images/a5df9ecf-6c20-4543-919e-3f8e7a3ec71a",
      "/api/images/12e52e9c-7992-4a93-9b5f-209a1fd577a5",
      "/api/images/9da4d767-c7c6-410f-9ad0-8b231888bbf9",
      "/api/images/528b719d-6964-48ad-900d-5003e8e6225c"
    ],
    "description": "Incluye control remoto",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "silla-escritorio-flexor-pro-mesh-grupo-a2",
    "title": "Silla Escritorio Flexor Pro Mesh  Grupo a2",
    "category": "Casa",
    "price": 250000,
    "status": "available",
    "image": "/api/images/d1f226fa-22ca-498a-8eb1-8d8e6e4f91a6",
    "images": [
      "/api/images/d1f226fa-22ca-498a-8eb1-8d8e6e4f91a6",
      "/api/images/3932d988-148b-433e-aa3e-f8ed66736dec",
      "/api/images/947c3775-85a6-41c7-9ca2-96edafe6b55d",
      "/api/images/0624d0ff-c77b-4b97-9ce6-2bffb7b7ab9b",
      "/api/images/2e2c1ed1-de5c-4bae-a8cd-0f6ec693aff9",
      "/api/images/e9095467-9726-4b40-847b-19ee1ea25093",
      "/api/images/7b3b3097-cc6e-49ad-95db-0bf79ff338ed",
      "/api/images/8af32271-de4f-4d68-ae21-d68a9ab45e0c"
    ],
    "description": "Apoyo lumbar regulable plástico\nBrazos regulables",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "set-9-cuchillos-tramontina-plenus-tabla-rectangular-tramontina",
    "title": "Set 9 Cuchillos Tramontina Plenus + Tabla Rectangular Tramontina",
    "category": "Casa",
    "price": 65000,
    "status": "reserved",
    "image": "/api/images/0bb1f2f8-b6a6-44ed-ac32-118bc38e81e1",
    "images": [
      "/api/images/0bb1f2f8-b6a6-44ed-ac32-118bc38e81e1"
    ],
    "description": "Los cuchillos vienen con base imantada",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "tv-50-pulgadas-4k-android-tv-marca-ths",
    "title": "TV 50 Pulgadas 4K Android TV Marca THS",
    "category": "Casa",
    "price": 380000,
    "status": "sold",
    "image": "/api/images/dd2254d7-9084-4a3b-a3c8-de52a9b52b11",
    "images": [
      "/api/images/dd2254d7-9084-4a3b-a3c8-de52a9b52b11",
      "/api/images/087b726a-91e8-4db9-a54d-2bf78e677932",
      "/api/images/4f528b90-23e6-4712-899a-199de566e059",
      "/api/images/e2c8bcdb-b8e6-4d56-9139-07942c911b56",
      "/api/images/f4a81739-d1f5-405b-a32a-a0272028c7b0",
      "/api/images/f6aa5af8-949a-4aee-98d0-da3b7dcbe50a"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "mesa-de-cama",
    "title": "Mesa de Cama",
    "category": "Casa",
    "price": 15,
    "status": "sold",
    "image": "/api/images/a8f51fca-1fa5-41f0-820c-0a8e79eb3e7b",
    "images": [
      "/api/images/a8f51fca-1fa5-41f0-820c-0a8e79eb3e7b",
      "/api/images/6da4788c-a271-4d74-9497-f3913d4bba31",
      "/api/images/43171e59-2dcc-4b8c-bc2e-5f226e462e70",
      "/api/images/20aff2f4-cb54-44cb-b19a-93cf22550354"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "masajeador-cervical-homedics",
    "title": "Masajeador Cervical Homedics",
    "category": "Casa",
    "price": 70000,
    "status": "available",
    "image": "/api/images/2e67bf82-5f3d-4bff-b6cb-3f0f4292a271",
    "images": [
      "/api/images/2e67bf82-5f3d-4bff-b6cb-3f0f4292a271",
      "/api/images/3523ee61-6b92-4ed7-aa84-014eb522b4c1",
      "/api/images/174cd42b-2f1b-47f1-810f-f406fccfe721",
      "/api/images/2634fe91-a83c-4596-9cb7-34ff1d4f51aa",
      "/api/images/cf1e64c5-e769-48bc-87b9-a8e1e73b529c"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "mesa-escritorio-regulable-en-altura-standing-desk-80-x-40",
    "title": "Mesa Escritorio Regulable en Altura Standing Desk 80 x 40",
    "category": "Casa",
    "price": 90000,
    "status": "available",
    "image": "/api/images/9b8d7c51-a1cd-4021-9e46-5834d2f72c7b",
    "images": [
      "/api/images/9b8d7c51-a1cd-4021-9e46-5834d2f72c7b",
      "/api/images/edacd977-81ee-4c81-8f63-78c8c6398e47",
      "/api/images/44672d83-b76d-4d2b-8cd3-dfdb0a9159a1",
      "/api/images/16a2afe3-e579-4f8c-abf9-a5193ba30639"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "freidora-de-aire-airfryer-kanjihome",
    "title": "Freidora de Aire Airfryer Kanjihome",
    "category": "Casa",
    "price": 80000,
    "status": "sold",
    "image": "/api/images/24b6ae0a-e12b-42b7-8c79-a32f8cec0ff4",
    "images": [
      "/api/images/24b6ae0a-e12b-42b7-8c79-a32f8cec0ff4",
      "/api/images/e3a008e1-e542-4b68-9cbc-9c432585d376",
      "/api/images/a98bfa74-d96e-4410-b212-c7c05d94dc32",
      "/api/images/ed07e815-6290-4b05-8227-ba8be58a1a7e"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "yogurtera-yelmo-yg-1717-yogur-griego-natural-20w-1-5-litros-2-contenedores",
    "title": "Yogurtera Yelmo YG-1717 Yogur Griego Natural 20W 1.5 Litros 2 contenedores",
    "category": "Casa",
    "price": 28000,
    "status": "sold",
    "image": "/api/images/dc64b2bd-462e-4f11-a62c-4c1c665eacab",
    "images": [
      "/api/images/dc64b2bd-462e-4f11-a62c-4c1c665eacab",
      "/api/images/06aef273-4cd6-46ad-b0d6-0fb91dcb7ee4"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "sillas-mecedora-acapulco-interior-o-exterior-mesa-con-vidrio",
    "title": "Sillas Mecedora Acapulco Interior o Exterior + Mesa con vidrio",
    "category": "Casa",
    "price": 190000,
    "status": "sold",
    "image": "/api/images/3e631d71-bd99-4f95-988d-7654109f721c",
    "images": [
      "/api/images/3e631d71-bd99-4f95-988d-7654109f721c",
      "/api/images/86e35e82-e1c4-459b-a994-ea696384d1e7",
      "/api/images/c47a8492-2b57-4a64-8851-e73e9566572d",
      "/api/images/6cae5667-83fc-4e10-8c80-5894501a8722",
      "/api/images/7e25253b-ebd8-4be6-8b42-bddde52d78e8"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "caloventor-mini-split-liliana-cw800-con-control",
    "title": "Caloventor Mini Split Liliana Cw800 con control",
    "category": "Casa",
    "price": 70000,
    "status": "available",
    "image": "/api/images/ec5a49e0-f405-4011-a763-53ad2a2eeff9",
    "images": [
      "/api/images/ec5a49e0-f405-4011-a763-53ad2a2eeff9",
      "/api/images/8656ac07-70d2-458d-b861-adf8462e8f5c"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "comoda-cajonera-blanca-y-madera-nordica",
    "title": "Cómoda Cajonera Blanca y Madera Nórdica",
    "category": "Muebles",
    "price": 220000,
    "status": "available",
    "image": "/api/images/8d828e2c-69ae-49c9-91c0-6508e937c92c",
    "images": [
      "/api/images/8d828e2c-69ae-49c9-91c0-6508e937c92c",
      "/api/images/039d333c-59af-4c4a-a877-d49b697a6c28",
      "/api/images/0091e983-e35d-434e-8054-884502f1c784",
      "/api/images/50b61b58-7757-4b3c-87ce-5945e2cabe08"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "lavarropaa-drean-concept",
    "title": "Lavarropaa Drean Concept",
    "category": "Casa",
    "price": 200000,
    "status": "sold",
    "image": "/api/images/50c6d951-4e2c-421b-8676-c95bc2b9b8c8",
    "images": [
      "/api/images/50c6d951-4e2c-421b-8676-c95bc2b9b8c8",
      "/api/images/1666367f-215f-45ca-8c3a-97628791edeb",
      "/api/images/b1944864-b47f-45a4-85c8-eeae680fc795"
    ],
    "description": "",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "heladera-electrolux-no-frost-df35g",
    "title": "Heladera Electrolux No Frost DF35G",
    "category": "Cocina",
    "price": 350000,
    "status": "sold",
    "image": "/api/images/3d0a6d17-64c4-47bf-b7d8-f47e7ce68643",
    "images": [
      "/api/images/3d0a6d17-64c4-47bf-b7d8-f47e7ce68643",
      "/api/images/7c5cec4e-de43-42c2-bccd-51a8af667c2c",
      "/api/images/98102ebf-71e6-4fdb-9c20-51f8a230d5ab",
      "/api/images/f629747d-25ab-4007-b233-ef7c3ee00de0"
    ],
    "description": "Funciona perfectamente.\n\nLas medidas de la heladera Electrolux DF35G son aproximadamente 170.7 cm de alto, 54.8 cm de ancho y 61.3 cm de profundidad.",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "sandwichera-electrica-bluesky-negra-750w-placas-antiadherentes-2-sandwiches",
    "title": "Sandwichera Eléctrica Bluesky Negra 750W Placas Antiadherentes 2 Sándwiches",
    "category": "Cocina",
    "price": 20000,
    "status": "sold",
    "image": "/api/images/8ea4112e-867e-4e85-94c0-88c073d6a271",
    "images": [
      "/api/images/8ea4112e-867e-4e85-94c0-88c073d6a271",
      "/api/images/ca024ddb-c5d4-43d3-adb1-adb4d949b290"
    ],
    "description": "Sandwichera Eléctrica Bluesky Negra 750W Placas Antiadherentes 2 Sándwiches\n\n1 año de uso. Tiene desgaste en el teflón pero no afecta su funcionamiento. Calienta perfectamente",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "comedor-eames-100-cm",
    "title": "Comedor Eames 100 cm",
    "category": "Casa",
    "price": 100000,
    "status": "available",
    "image": "/api/images/c247b9b4-d71b-45de-9df0-64f78576649f",
    "images": [
      "/api/images/c247b9b4-d71b-45de-9df0-64f78576649f",
      "/api/images/99f511b3-ea07-448b-95e3-5c3968c31a80",
      "/api/images/9f4dd7d3-89dd-4e65-a659-95630cb71024"
    ],
    "description": "Comedor Eames 100 CM Diámetro",
    "featured": false,
    "isPublic": true
  },
  {
    "id": "comedor-eames-100-cm-4-sillas-nordicas",
    "title": "Comedor Eames 100 CM + 4 Sillas Nordicas",
    "category": "Muebles",
    "price": 450000,
    "status": "available",
    "image": "/api/images/599e5728-44b8-45ed-862c-635f5ab13dc2",
    "images": [
      "/api/images/599e5728-44b8-45ed-862c-635f5ab13dc2",
      "/api/images/849111ab-7603-4596-8690-39c005e87e45",
      "/api/images/6c73dd1f-59a6-494a-a6c2-8120516dc564",
      "/api/images/bd58b40f-0d62-4344-9990-bb3b7a0a1c32",
      "/api/images/94c08ac9-0053-4a28-8eed-d19c46182985"
    ],
    "description": "",
    "featured": true,
    "isPublic": true
  },
  {
    "id": "sillon-ancora-dos-plazas",
    "title": "Sillon Ancora Dos Plazas",
    "category": "Muebles",
    "price": 500000,
    "status": "reserved",
    "image": "/api/images/026284c2-7a39-44b5-9416-33a1f95fb68a",
    "images": [
      "/api/images/026284c2-7a39-44b5-9416-33a1f95fb68a",
      "/api/images/3e6c45e0-5a26-4df4-8d6d-18702876be04",
      "/api/images/26ce0251-5c68-47f5-b165-d11bff1b52b2",
      "/api/images/b00357f7-3fe9-4438-bfea-f3a805c79942",
      "/api/images/f243a6f7-4687-43f8-a438-7db5e9a802e0",
      "/api/images/dbd74175-599a-42f1-9ca2-5a31868952ed"
    ],
    "description": "Sillón 2 cuerpos bastante amplio, tela pana, muy cómodo.\nSe retira en boedo cerca de la estación del subte.",
    "featured": true,
    "isPublic": true
  }
];

export const categories = ['Todo', 'Casa', 'Muebles', 'Cocina', 'Decoración', 'Varios'];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

export const statusLabel = {
  available: 'Todavía está',
  reserved: 'Casi se va',
  sold: 'Ya se fue!',
};
