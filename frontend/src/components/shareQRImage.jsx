import logoImg from "../assets/logo_congreso.png"

export const shareQrImage = async (qrCanvas, nombre, tipoInvitado, share, download) => {
    if (!qrCanvas) {
        alert("No se pudo obtener el QR.")
        return
    }

    const qrSize = qrCanvas.width
    const padding = 60
    const textBoxHeight = 50
    const spacing = 20

    // Cargar imagen del logo
    const logo = new Image()
    logo.src = logoImg

    logo.onload = () => {
        const logoHeight = 80
        const logoSpacing = 30
        const height = qrSize + padding * 2 + (textBoxHeight + spacing) * 3 + logoHeight + logoSpacing
        const width = qrSize + padding * 4

        const finalCanvas = document.createElement("canvas")
        finalCanvas.width = width
        finalCanvas.height = height
        const ctx = finalCanvas.getContext("2d")

        // Fondo degradado
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, "#ffffffff")
        gradient.addColorStop(1, "#500d41ff")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)

        // Dibujar logo centrado 
        const logoWidth = (logo.width / logo.height) * logoHeight
        const logoX = (width - logoWidth) / 2
        const logoY = padding // lo ponemos arriba con margen
        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight)

        // QR debajo del logo
        const qrX = (width - qrSize) / 2
        const qrY = logoY + logoHeight + logoSpacing
        const borderRadius = 30

        const borderPadding = 8 // grosor del margen
        ctx.fillStyle = "#ffffff"
        drawRoundedRect(
            ctx,
            qrX - borderPadding,
            qrY - borderPadding,
            qrSize + borderPadding * 2,
            qrSize + borderPadding * 2,
            borderRadius
        )
        ctx.fill()



        // Dibujar QR dentro del marco
        ctx.drawImage(qrCanvas, qrX, qrY)

        // Dibujar texto dentro de cajas blancas
        const textos = [
            { text: `Tipo de Invitado: ${tipoInvitado}`, font: "bold 22px 'Segoe UI', sans-serif" },
            { text: "Preséntalo para ingresar o salir del edificio", font: "italic 18px 'Segoe UI', sans-serif" }
        ]

        let y = qrY + qrSize + spacing + 70

        textos.forEach(({ text, font }) => {
            ctx.font = font
            const textWidth = ctx.measureText(text).width
            const boxWidth = textWidth + 40
            const boxX = (width - boxWidth) / 2

            // Caja blanca
            ctx.fillStyle = "#fff"
            drawRoundedRect(ctx, boxX, y, boxWidth, textBoxHeight, 20)
            ctx.fill()

            // Texto negro
            ctx.fillStyle = "#000"
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillText(text, width / 2, y + textBoxHeight / 2)

            y += textBoxHeight + spacing
        })

        if(share) {
            // Convertir a imagen y compartir
            finalCanvas.toBlob(async (blob) => {
                if (!blob) {
                    alert("No se pudo crear la imagen.")
                    return
                }

                const file = new File([blob], `${nombre || "qr"}.png`, { type: "image/png" });
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: "QR Invitado",
                            text: `QR de ${nombre}`,
                            files: [file],
                        });
                    } catch (err) {
                        console.error("Error compartiendo", err);
                    }
                } else {
                    setAlert({ open: true, message: "Tu navegador no soporta compartir imágenes", severity: "warning" });
                }
            })
        }
        
        if (download) {
            finalCanvas.toBlob((blob) => {
                if (!blob) {
                    alert("No se pudo crear la imagen.")
                    return
                }

                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `${nombre || "qr"}.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url) // liberar memoria
            })
        }

    }

    logo.onerror = () => {
        alert("No se pudo cargar el logo del congreso.")
    }
}

// Función para dibujar rectángulos redondeados
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
}
