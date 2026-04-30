"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

import { revalidatePath } from "next/cache";

export async function changePassword(userId: string, currentPass: string, newPass: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    const isValid = await bcrypt.compare(currentPass, user.password);
    if (!isValid) {
      return { success: false, error: "La contraseña actual es incorrecta" };
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, error: "Error al cambiar la contraseña" };
  }
}

export async function updateProfileImage(userId: string, imageData: string | null) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { image: imageData }
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile image:", error);
    return { success: false, error: "Error al actualizar la imagen de perfil" };
  }
}
