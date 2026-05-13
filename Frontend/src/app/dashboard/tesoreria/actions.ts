"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- Gestión de Conceptos de Cobro (FeeType) ---

export async function getFeeTypes() {
  return await prisma.feeType.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createFeeType(data: { name: string; amount: number; description?: string }) {
  const feeType = await prisma.feeType.create({
    data
  });
  revalidatePath("/dashboard/tesoreria");
  return feeType;
}

export async function updateFeeType(id: string, data: { name: string; amount: number; description?: string }) {
  const feeType = await prisma.feeType.update({
    where: { id },
    data
  });
  revalidatePath("/dashboard/tesoreria");
  return feeType;
}

export async function deleteFeeType(id: string) {
  await prisma.feeType.delete({
    where: { id }
  });
  revalidatePath("/dashboard/tesoreria");
}

// --- Gestión de Facturas (Invoices) ---

export async function getInvoices(filters?: { studentId?: string; status?: any; courseId?: string }) {
  return await prisma.invoice.findMany({
    where: {
      studentId: filters?.studentId,
      status: filters?.status,
      student: filters?.courseId ? { courseId: filters.courseId } : undefined
    },
    include: {
      student: {
        include: { course: true }
      },
      feeType: true,
      payments: true
    },
    orderBy: { dueDate: 'asc' }
  });
}

/**
 * Genera facturas masivamente para todos los estudiantes de un curso o de todo el colegio
 * basándose en un concepto de cobro (FeeType).
 */
export async function generateInvoices(data: { 
  feeTypeId: string; 
  courseId?: string; 
  dueDate: Date; 
  month: number; 
  year: number;
  notes?: string;
}) {
  const feeType = await prisma.feeType.findUnique({ where: { id: data.feeTypeId } });
  if (!feeType) throw new Error("Concepto de cobro no encontrado");

  const students = await prisma.student.findMany({
    where: data.courseId ? { courseId: data.courseId } : {},
    select: { id: true }
  });

  const invoices = await Promise.all(
    students.map(student => 
      prisma.invoice.upsert({
        where: {
          studentId_feeTypeId_month_year: {
            studentId: student.id,
            feeTypeId: data.feeTypeId,
            month: data.month,
            year: data.year
          }
        },
        update: {
          amount: feeType.amount,
          dueDate: data.dueDate,
          notes: data.notes
        },
        create: {
          studentId: student.id,
          feeTypeId: data.feeTypeId,
          amount: feeType.amount,
          dueDate: data.dueDate,
          month: data.month,
          year: data.year,
          notes: data.notes
        }
      })
    )
  );

  revalidatePath("/dashboard/tesoreria");
  return invoices.length;
}

// --- Gestión de Pagos (Payments) ---

export async function registerPayment(data: {
  invoiceId: string;
  amount: number;
  method: string;
  reference?: string;
  date: Date;
  notes?: string;
}) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
    include: { payments: true }
  });

  if (!invoice) throw new Error("Factura no encontrada");

  const totalPaidBefore = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaidAfter = totalPaidBefore + data.amount;

  let newStatus: any = "PARTIAL";
  if (totalPaidAfter >= invoice.amount) {
    newStatus = "PAID";
  }

  const payment = await prisma.payment.create({
    data: {
      invoiceId: data.invoiceId,
      amount: data.amount,
      method: data.method,
      reference: data.reference,
      date: data.date,
      notes: data.notes
    }
  });

  await prisma.invoice.update({
    where: { id: data.invoiceId },
    data: { status: newStatus }
  });

  revalidatePath("/dashboard/tesoreria");
  return payment;
}

// --- Estadísticas y Reportes ---

export async function getTesoreriaStats() {
  const invoices = await prisma.invoice.findMany({
    include: { payments: true }
  });

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.reduce((sum, inv) => 
    sum + inv.payments.reduce((pSum, p) => pSum + p.amount, 0), 0
  );
  const totalPending = totalBilled - totalPaid;

  const pendingCount = invoices.filter(inv => inv.status === 'PENDING' || inv.status === 'PARTIAL').length;
  const overdueCount = invoices.filter(inv => inv.status === 'OVERDUE' || (inv.status !== 'PAID' && new Date(inv.dueDate) < new Date())).length;

  return {
    totalBilled,
    totalPaid,
    totalPending,
    pendingCount,
    overdueCount
  };
}
