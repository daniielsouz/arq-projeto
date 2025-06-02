require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { ObjectId } = require('mongodb');
const router = express.Router();
const db = require('../db.js');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

function uploadToCloudinary(fileBuffer, folder = '') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve({ url: result.secure_url, public_id: result.public_id });
    });
    stream.end(fileBuffer);
  });
}

router.get('/', async (req, res) => {
  try {
    const projetos = await db.findLatestThree();
    res.json(projetos);
  } catch (error) {
    console.error('Erro ao buscar últimos projetos:', error);
    res.status(500).send('Erro ao buscar projetos');
  }
});

router.get(['/portifolio', '/adm'], async (req, res) => {
  try {
    const projetos = await db.find();
    res.json(projetos);
  } catch (error) {
    console.error('Erro ao buscar todos projetos:', error);
    res.status(500).send('Erro ao buscar projetos');
  }
});

router.get('/project/:id', async (req, res) => {
  try {
    const dbData = await db.findById(req.params.id);
    if (!dbData) return res.status(404).send('Projeto não encontrado');
    res.json(dbData);
  } catch (error) {
    console.error('Erro interno ao buscar projeto:', error);
    res.status(500).send('Erro interno');
  }
});

router.delete('/portifolio/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const dbConn = await db.connect();
    
    const projeto = await dbConn.collection('projetos').findOne({ _id: new ObjectId(id) });

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado para deletar' });
    }

    if (projeto.coverImg?.public_id) {
      await cloudinary.uploader.destroy(projeto.coverImg.public_id);
    }

    if (Array.isArray(projeto.galeryImg)) {
      for (const img of projeto.galeryImg) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    const result = await dbConn.collection('projetos').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Projeto não encontrado para deletar' });
    }

    res.json({ message: 'Projeto e imagens deletados com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar projeto e imagens:', error);
    res.status(500).json({ message: 'Erro interno ao deletar projeto' });
  }
});

router.delete('/portifolio/:projectId/imagem', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const imageUrl = req.query.imageUrl;

    if (!imageUrl) {
      return res.status(400).json({ message: 'Informe o URL da imagem para apagar' });
    }

    const dbConn = await db.connect();
    const projeto = await dbConn.collection('projetos').findOne({ _id: new ObjectId(projectId) });

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    const image = projeto.galeryImg.find(img => img.url === imageUrl);

    if (!image) {
      return res.status(404).json({ message: 'Imagem não encontrada no projeto' });
    }

    await cloudinary.uploader.destroy(image.public_id);

    const result = await dbConn.collection('projetos').updateOne(
      { _id: new ObjectId(projectId) },
      { $pull: { galeryImg: { url: imageUrl } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Imagem não encontrada no projeto' });
    }

    res.json({ message: 'Imagem apagada com sucesso!' });
  } catch (error) {
    console.error('Erro ao apagar imagem:', error);
    res.status(500).json({ message: 'Erro ao apagar imagem' });
  }
});

router.post(
  '/saveProject',
  upload.fields([
    { name: 'coverImg', maxCount: 1 },
    { name: 'galeryImg', maxCount: 20 },
  ]),
  async (req, res) => {
    try {
      const { nameProject } = req.body;
      const coverImg = req.files.coverImg?.[0];
      const galeryImgs = req.files.galeryImg || [];

      if (!coverImg) {
        return res.status(400).send('Imagem de capa não enviada.');
      }

      const coverData = await uploadToCloudinary(coverImg.buffer, 'projetos');
      const galeryData = await Promise.all(
        galeryImgs.map(file => uploadToCloudinary(file.buffer, 'projetos'))
      );

      const project = {
        nameProject,
        coverImg: coverData,
        galeryImg: galeryData,
        createdAt: new Date(),
      };

      await db.insert(project);

      res.status(201).json({ message: 'Projeto salvo com sucesso' });
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      res.status(500).send('Erro ao salvar projeto');
    }
  }
);

router.post('/portifolio/:projectId/imagens', upload.array('galeryImg', 20), async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const galeryImg = req.files;

    if (!galeryImg.length) {
      return res.status(400).json({ message: "Nenhuma imagem enviada" });
    }

    const galeryData = await Promise.all(
      galeryImg.map(file => uploadToCloudinary(file.buffer, 'projetos'))
    );

    const dbConn = await db.connect();

    await dbConn.collection('projetos').updateOne(
      { _id: new ObjectId(projectId) },
      { $push: { galeryImg: { $each: galeryData } } }
    );
    res.json({ message: "Imagens adicionadas com sucesso" });
  } catch (error) {
    console.error('Erro ao adicionar imagens:', error);
    res.status(500).json({ message: "Erro ao adicionar imagem" });
  }
});

router.put('/portifolio/:id', async (req, res) => {
  try {
    const { nameProject } = req.body;
    const id = req.params.id;

    if (!nameProject) {
      return res.status(400).json({ message: 'Nome do projeto é obrigatório' });
    }

    const dbConn = await db.connect();
    const result = await dbConn.collection('projetos').updateOne(
      { _id: new ObjectId(id) },
      { $set: { nameProject } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Projeto não encontrado ou nome já era igual' });
    }

    res.json({ message: 'Nome do projeto atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar nome do projeto:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar projeto' });
  }
});

module.exports = router;
