import {Kafka} from "kafkajs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

class KafkaConfig{
    constructor(){
        this.kafka=new Kafka({
            clientId:"upload-service",
            brokers:["kafka-14185563-prisma-prac.f.aivencloud.com:26609"],
            ssl:{
                ca:[fs.readFileSync(path.resolve("./ca.pem"),'utf-8')],
            },
            sasl:{
                username:process.env.KAFKA_AIVEN_USERNAME,
                password:process.env.KAFKA_AIVEN_PWD,
                mechanism:"plain"

            }
        })
        this.producer=this.kafka.producer();
        this.consumer=this.kafka.consumer({groupId:"upload-service"});
    }

    // !this is the generic producer function 

    async produce(topic,message){
        try {

            const result=await this.producer.connect();
            console.log("Kafka connected .... : ",result);
            await this.producer.send({
                topic:topic,
                messages:message
            })
            
        } catch (error) {
            console.log("this error is in the produce funtion of kafka config ",error);
            
        }finally{
            await this.producer.disconnect();
        }
    }

    // !this is the generic consumer function 
    async consume(topic,callback){
        try {

            await this.consumer.connect();
            // !do understand the usecase of fromBeggining:true or false
            // !simoly speaking true karoge toh jotodi message ai channel e aise from beginning aibo r false karle okhon jei offset e aise ai message ta e aibo 
            await this.consumer.subscribe({topic:topic,fromBeginning:true});
            // !go through the docs and unserstand why are you writing such code 
            await this.consumer.run({
                eachMessage:async ({
                    topic,partition,message
                })=>{
                    const value=message.value.toString();
                    callback(value);
                }
            })
            
        } catch (error) {

            console.log("this error is in the consume funtion of kafka config ",error);
            
        }
    }
}


export default KafkaConfig;

