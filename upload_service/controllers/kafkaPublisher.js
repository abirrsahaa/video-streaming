import KafkaConfig from "../kafka/kafka.js";


const sendMessageToKafka=async (req,res)=>{
    console.log(" i am in the kafka send message api controller");
    try {
        // !pura object ta e message banai la backend e pathaitasos
        const message=req.body;
        console.log("body ... : ",message);
        const kafkaConfig=new KafkaConfig();
        const msgs=[
            {
                key:"key1",
                value: JSON.stringify(message)
            }
        ]
        // !this is for our transcoder service 
        const result= await kafkaConfig.produce('transcode',msgs);
        console.log("the result of the transcode produce is .. : ",result);
        return res.status(200).json("message of transcoder published successfully");
        
    } catch (error) {
        console.log("this error is in the kafka send message api controller ",error);
        
    }

    
}


export const PublishToKafkaToTranscode=async(title,key)=>{
    try {

        console.log(" i am in the PublishToKafkaToTranscode controller");

        const message={
            "title":title,
            "key":key
        }

        const kafkaConfig=new KafkaConfig();
        const msgs=[
            {
                key:"video",
                value: JSON.stringify(message)
            }
        ]

        const result=await kafkaConfig.produce('transcode',msgs);
        console.log("the result of the transcode produce is .. : ",result);




        
    } catch (error) {
        console.log("this error is in the PublishToKafkaToTranscode controller ",error);
        
    }
}

export default sendMessageToKafka;