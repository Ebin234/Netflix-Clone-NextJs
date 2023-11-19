import connectToDB from "@/database";
import Account from "@/models/Account";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
    try {
        await connectToDB()
        
        const {pin,accountId,uid} = await req.json()
        const currentAccount = await Account.findOne({_id:accountId,uid})
        if(!currentAccount) {
            return NextResponse.json({
                success:false,
                message:"Account not found"
            })
        }

        const checkPin = await compare(pin,currentAccount.pin)
        if(checkPin){
            return NextResponse.json({
                success:true,
                message:"Welcomme to Netflix"
            })
        }else{
            return NextResponse.json({
                success:false,
                message:"Incorrect pin! please try again"
            })
        }
    } catch (error) {
        return NextResponse.json({
            success : false,
            message:"Something went wrong",
        });
    }
}