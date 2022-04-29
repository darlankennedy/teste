module.exports = app => {
  
     const compra = app.models.Compra
     const item   = app.models.ProdutosCompra
  

    const {iqualOrError,existeOrError,notExisteOrError}  = app.validations.validations;
    /// index retorna todos os produtos
    const index = async (req,res)=>{
       const result = await compra.query();
        
        return res.send({
            "status":200,
            "compras":result
        });
    }

    ///cria um novo comrpa 
    const create = async (req,res)=>{
        const compraBody  = {...req.body}

        try {

            existeOrError(compraBody.tipoPagamento,"Tipo de Pagamento Vazio!")

            const compraForm = await compra.query().insert({
                total: compraBody.total,
                tipo_pagamento: compraBody.tipoPagamento,
                status: compraBody.status
              });
              
             return res.send({
                 "status":200,
                 "msg":"Cadastrada Com Sucesso!",
                 "compra":compraForm
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

        const compra_id  = req.params.id

        try{
            const result = await compra.query().findById(compra_id);

            existeOrError(result,"Compra não existe!")
            

            return res.send({
                "status":200,
                "Compra":result
            });

        } catch (msg){
            
            return res.status(400).json({
                "status":400,
                "msg":msg
            })
        }
    }


    const edit = async (req,res) =>{

        const compra_id  = req.params.id
        const compraBody = {...req.body}
       

        try {
            const resultConsulta = await compra.query()
            .findById(compra_id);

            existeOrError(resultConsulta,"Compra não existe!")

            existeOrError(compraBody.tipoPagamento,"Tipo de Pagamento Vazio!")


            const result = await compra.query()
            .patchAndFetchById(compra_id,{
                total: compraBody.total,
                tipo_pagamento: compraBody.tipoPagamento,
                status: compraBody.status
            });

            return res.send({
                "status":200,
                "msg":"Alterado Com Sucesso!",
                "compra":result
            });


        } catch (msg) {

            return res.status(400).json({
                "status":400,
                "msg":msg
            })

        }

    }

    //delete
    const delet = async (req,res) =>{
        const compra_id  = req.params.id

        try {
            const result = await compra.query().deleteById(compra_id);

            existeOrError(result,"Erro ao Deletar!")

             return res.send({
                "status":200,
                "msg":"Deletado Com Sucesso!",
                "Compras":result
            });

        } catch (msg) {

              return res.status(400).json({
                "status":400,
                "msg":msg
            });

        }

    }


  async function pegarItem(id){
        const result = await item.query().where('comp_id',id).then(data=>{
            return data
        }).catch(err=>{
            console.log(err)
        });    
    }

    const getAllCompraProdutos = async (req,res) => {
        
        
        const compras = await compra.query()
        .whereExists(
            item.query()
              .select(1)
              .whereColumn('comp_id', 'compras.id')
          );
    
        for(var i=0;i<compras.length;i++){
            
           var array =  pegarItem(compras[i].id)
            compras[i].itemCompras = array
        }


        console.log(compras)

        

    }

    return {index,create,getById,edit,delet,getAllCompraProdutos}
}