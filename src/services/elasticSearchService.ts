import elasticsearch from 'elasticsearch';


export const client = new elasticsearch.Client({
  host: 'http://localhost:9200',
  log: 'trace', 
});


const addDocument = async (indexName: string, document: any) => {
  try {
    const response = await client.index({
      index: indexName, 
      type: '_doc',
      body: document, 
    });

    console.log('Documento adicionado com sucesso:', response);
  } catch (error) {
    console.error('Erro ao adicionar documento:', error.message);
  }
};

const checkConnection = async () => {
  try {
    const health = await client.ping({ requestTimeout: 3000 });
    console.log('Conexão com Elasticsearch bem-sucedida!');
  } catch (error) {
    console.error('Elasticsearch não está disponível:', error.message);
  }
};


const bulkInsert = async (operations: any[]) => {
  return await client.bulk({
    refresh: true,
    body: operations,
  });
};

// Função para busca no Elasticsearch
const search = async (params: any) => {
  return await client.search(params);
};



export default {
  addDocument,
  checkConnection,
  bulkInsert,
  search
};