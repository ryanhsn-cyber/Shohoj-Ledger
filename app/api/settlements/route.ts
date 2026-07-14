import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const month = parseInt(url.searchParams.get("month") || "");
    const year = parseInt(url.searchParams.get("year") || "");

    if (isNaN(month) || isNaN(year)) {
      // Just fetch all settlements
      const settlements = await prisma.settlement.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(settlements);
    }

    // PREVIEW CALCULATION for a specific month/year
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const incomes = await prisma.income.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        paymentStatus: { in: ["PAID", "PARTIAL"] },
        shareable: true
      }
    });

    const expenses = await prisma.expense.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        approvalStatus: "APPROVED"
      }
    });

    const totalIncome = incomes.reduce((sum, inc) => sum + Number(inc.received), 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
    const netProfit = totalIncome - totalExpenses;

    // Distribution logic (e.g., Development: CEO 40%, Dev 20%, Co 40%)
    // If netProfit is negative, shares are 0.
    const ceoShare = netProfit > 0 ? netProfit * 0.40 : 0;
    const developerShare = netProfit > 0 ? netProfit * 0.20 : 0;
    const companyShare = netProfit > 0 ? netProfit * 0.40 : 0;

    return NextResponse.json({
      period: `${startDate.toLocaleString('default', { month: 'long' })} ${year}`,
      totalIncome,
      totalExpenses,
      netProfit,
      ceoShare,
      developerShare,
      companyShare
    });
  } catch (error) {
    console.error("Error with settlements GET:", error);
    return NextResponse.json({ error: "Failed to process settlement request" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { period, totalIncome, totalExpenses, ceoShare, developerShare, companyShare } = body;

    const settlement = await prisma.settlement.create({
      data: {
        period,
        totalIncome,
        totalExpenses,
        ceoShare,
        developerShare,
        companyShare,
        status: "PENDING"
      }
    });

    return NextResponse.json(settlement, { status: 201 });
  } catch (error) {
    console.error("Error creating settlement:", error);
    return NextResponse.json({ error: "Failed to record settlement" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || action !== "EXECUTE") {
      return NextResponse.json({ error: "Invalid execution request" }, { status: 400 });
    }

    const settlement = await prisma.settlement.findUnique({ where: { id } });
    if (!settlement || settlement.status !== "PENDING") {
      return NextResponse.json({ error: "Settlement not found or already executed" }, { status: 400 });
    }

    // Execute the settlement within a transaction
    const [updatedSettlement, reserveDeposit] = await prisma.$transaction([
      // 1. Mark Settlement as Executed
      prisma.settlement.update({
        where: { id },
        data: { status: "EXECUTED" }
      }),
      // 2. Auto-transfer the Company portion to the Reserve Balance
      prisma.reserveTransaction.create({
        data: {
          type: "DEPOSIT",
          amount: settlement.companyShare,
          reason: `Auto-deposit from ${settlement.period} Settlement`,
          // Note: The current Prisma schema for ReserveTransaction might not have settlementId explicitly linked,
          // but we can add it to the reason/description.
        }
      })
    ]);

    return NextResponse.json(updatedSettlement);
  } catch (error) {
    console.error("Error executing settlement:", error);
    return NextResponse.json({ error: "Failed to execute settlement" }, { status: 500 });
  }
}
