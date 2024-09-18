import { Chance } from "chance";
import { Request, Response } from 'express';
import db from '../services/postgresService';
import elasticSearchService from "../services/elasticSearchService";

const chance = new Chance();

interface DocumentData {
  id: string;
  title: string;
  author: string;
  content: string;
  tags: string[];
  published_date: Date;
  summary: string;
  category: string;
}

const generateRandomDocuments = (count: number): DocumentData[] => {
  const documents: DocumentData[] = [];
  for (let i = 0; i < count; i++) {
    documents.push({
      id: chance.guid(),
      title: chance.sentence({ words: 5 }),
      author: chance.name(),
      content: chance.paragraph() + (Math.random() < 0.1 ? " specialKeyword" : ""),
      tags: chance.unique(chance.word, chance.integer({ min: 1, max: 5 })),
      published_date: chance.date(),
      summary: chance.sentence(),
      category: chance.pickone(["Technology", "Science", "Art", "History", "Health"]),
    });
  }
  return documents;
};

const bulkInsertPostgres = async (documents: DocumentData[]) => {
  const values = documents.map(doc => [
    doc.id,
    doc.title,
    doc.author,
    doc.content,
    doc.tags,
    doc.published_date,
    doc.summary,
    doc.category
  ]);

  const placeholders = documents
    .map((_, index) => `(${[...Array(8)].map((_, i) => `$${index * 8 + i + 1}`).join(", ")})`)
    .join(", ");

  const queryText = `
    INSERT INTO documents (id, title, author, content, tags, published_date, summary, category)
    VALUES ${placeholders}
  `;

  try {
    await db.query(queryText, values.flat());
    console.log(`${documents.length} documentos inseridos no PostgreSQL com sucesso!`);
  } catch (error) {
    console.error('Erro ao inserir documentos no PostgreSQL:', error.message);
    throw error;
  }
};

const bulkInsertElasticsearch = async (documents: DocumentData[]) => {
  const operations = documents.flatMap(doc => [
    { index: { _index: 'documents', _id: doc.id } },
    {
      title: doc.title,
      author: doc.author,
      content: doc.content,
      tags: doc.tags,
      published_date: doc.published_date,
      summary: doc.summary,
      category: doc.category
    }
  ]);

  try {
    const response = await elasticSearchService.bulkInsert(operations);
    console.log(`Indexação em massa realizada com sucesso:`, response);
  } catch (error) {
    console.error('Erro ao indexar documentos no Elasticsearch:', error.message);
    throw error;
  }
};

export const bulkInsertHandler = async (req: Request, res: Response) => {
  const { count } = req.query;

  if (!count || isNaN(Number(count))) {
    return res.status(400).json({ error: "Parâmetro 'count' é obrigatório e deve ser um número." });
  }

  const documentCount = parseInt(count as string, 10);

  try {
    const documents = generateRandomDocuments(documentCount);

    await bulkInsertPostgres(documents);
    await bulkInsertElasticsearch(documents);

    res.status(200).json({ message: `${documentCount} documentos inseridos e indexados com sucesso!` });
  } catch (error) {
    console.error('Erro ao executar o fluxo de inserção:', error.message);
    res.status(500).json({ error: 'Erro ao executar o fluxo de inserção.' });
  }
};