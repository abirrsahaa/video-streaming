import {PrismaClient} from '@prisma/client';
const prisma= new PrismaClient();


export async function addVideoDetailsToDB(title,description,author,url){
    const videoData=await prisma.videoData.create({
        data:{
            title:title,
            description:description,
            author:author,
            url:url
        }
    })

    console.log("the video data is -> ",videoData);
}