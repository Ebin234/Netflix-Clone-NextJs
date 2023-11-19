import connectToDB from "@/database";
import Account from "@/models/Account";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDB();
    
    const { name, pin, uid } = await req.json();
    const isAccountAlreadyExist = await Account.find({ uid, name });
    if ( isAccountAlreadyExist?.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Please try with a different name",
      });
    }

    const accounts = await Account.find({});
    if (accounts?.length === 4) {
      return NextResponse.json({
        success: false,
        message: "You can only add max 4 accounts",
      });
    }

    const hashPin = await hash(pin, 12);
    const newlyCreatedAccount = await Account.create({
      name,
      pin: hashPin,
      uid,
    });

    if (newlyCreatedAccount) {
      return NextResponse.json({
        success: true,
        message: "Account created successfully",
      });
    }else {
      return NextResponse.json({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
