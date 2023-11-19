import connectToDB from "@/database";
import Favorites from "@/models/Favorite";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        await connectToDB()

        const {searchParams} = new URL(req.url)
        const id = searchParams.get("id")
        const accountID = searchParams.get("accountID")

        const favorites = await Favorites.find({uid:id,accountID})

        if(favorites){
            return NextResponse.json({
                success:true,
                data:favorites,
            })
        }else{
            return NextResponse.json({
                success:false,
                message:"Something went wrong",
            })
        }
    } catch (error) {
        return NextResponse.json({
            success : false,
            message:"Something went wrong",
        });
    }
}