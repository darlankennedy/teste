module.exports = app => {
  
    const produto = app
    const {iqualOrError,existeOrError,notExisteOrError}  = require('../validations/validations')
    /// index retorna todos os produtos
    const index = async (req,res)=>{
       const result = await produto.query();
        
        return res.send({
            "status":200,
            "produtos":result
        });
    }

    ///cria um novo produto 
    const create = async (req,res)=>{
        const produtoBody  = {...req.body}
        try {

            existeOrError(produtoBody.nome,"Nome Vazio!")
            existeOrError(produtoBody.preco,"Preço Vazio!")
            existeOrError(produtoBody.descricao,"Descrição vazia!")

            const produtoForm = await produto.query().insert({
                nome: produtoBody.nome,
                descricao: produtoBody.descricao,
                preco: produtoBody.preco
              });
              
             return res.send({
                 "status":200,
                 "msg":"Cadastrado Com Sucesso!",
                 "produto":produtoForm
             }) 

        } catch (msg) {
           
            return res.status(400).json({
                "status":400,
                "msg":msg
            })
        }
        
    }
    

    ///pesquisa por id 
    const getById = async (req,res)=>{

        const produto_id  = req.params.id
       
        try{
            const result = await produto.query().findById(produto_id);

            existeOrError(result,"Produto não existe!")

            return res.send({
                "status":200,
                "produtos":result
            });

        } catch (msg){
            
            return res.status(400).json({
                "status":400,
                "msg":msg
            })
        }
    }


    const edit = async (req,res) =>{
        const produto_id  = req.params.id
        const produtoBody = {...req.body}
       
        try {
            const resultConsulta = await produto.query()
            .findById(produto_id);

            existeOrError(resultConsulta,"Produto não existe!");

            existeOrError(produtoBody.nome,"Nome Vazio!");
            existeOrError(produtoBody.preco,"Preço Vazio!");
            existeOrError(produtoBody.descricao,"Descrição vazia!");

            const result = await produto.query()
            .patchAndFetchById(produto_id,{
                nome:produtoBody.nome,
                descricao:produtoBody.descricao,
                preco:produtoBody.preco
            });

            return res.send({
                "status":200,
                "msg":"Alterado Com Sucesso!",
                "produto":result
            });


        } catch (msg) {

            return res.status(400).json({
                "status":400,
                "msg":msg
            })

        }

    }


    const delet = async (req,res) =>{
        const produto_id  = req.params.id

        try {
            const result = await produto.query().deleteById(produto_id);

            existeOrError(result,"Erro ao Deletar!")

             return res.send({
                "status":200,
                "msg":"Deletado Com Sucesso!",
                "produtos":result
            });

        } catch (msg) {

              return res.status(400).json({
                "status":400,
                "msg":msg
            });

        }

    }


    return {index,create,getById,edit,delet}
}