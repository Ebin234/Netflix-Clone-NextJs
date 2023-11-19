import connectToDB from "@/database";
import Account from "@/models/Account";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        await connectToDB()
        
        const {searchParams} = new URL(req.url)
        const id = searchParams.get("id")
        const accounts = await Account.find({uid:id})

        if(accounts){
            return NextResponse.json({
                success:true,
                data:accounts,
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