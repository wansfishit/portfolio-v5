import React, { useEffect, useRef } from "react"

const AnimatedBackground = () => {
  const blobRefs = useRef([])
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const initialPositions = [
    { x: -4, y: 0 },
    { x: -4, y: 0 },
    { x: 20, y: -8 },
    { x: 20, y: -8 },
  ]

  useEffect(() => {
    let currentScroll = 0
    let requestId

    const handleScroll = () => {
      const newScroll = window.pageYOffset
      currentScroll = newScroll

      blobRefs.current.forEach((blob, index) => {
        if (!blob) return
        const initialPos = initialPositions[index]
        const xOffset = Math.sin(newScroll / 100 + index * 0.5) * 340
        const yOffset = Math.cos(newScroll / 100 + index * 0.5) * 40

        const x = initialPos.x + xOffset
        const y = initialPos.y + yOffset

        blob.style.transform = `translate(${x}px, ${y}px)`
        blob.style.transition = "transform 1.4s ease-out"
      })

      requestId = requestAnimationFrame(handleScroll)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(requestId)
    }
  }, [])

  // Canvas Space Stars Particle System
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animFrameId

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    const particleCount = window.innerWidth < 768 ? 40 : 80
    const particles = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        baseSpeedX: Math.random() * 0.3 - 0.15,
        baseSpeedY: Math.random() * 0.3 - 0.15,
        speedX: 0,
        speedY: 0,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const mouse = mouseRef.current
      const rootStyles = getComputedStyle(document.documentElement)
      const primaryRGB = rootStyles.getPropertyValue('--primary-color-rgb').trim() || "99, 102, 241"
      const secondaryRGB = rootStyles.getPropertyValue('--secondary-color-rgb').trim() || "168, 85, 247"

      particles.forEach((p, index) => {
        p.speedX += (p.baseSpeedX - p.speedX) * 0.05
        p.speedY += (p.baseSpeedY - p.speedY) * 0.05
        
        if (mouse.x !== -1000) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            const force = (150 - dist) / 150
            p.speedX += (dx / dist) * force * 0.4
            p.speedY += (dy / dist) * force * 0.4
          }
        }

        p.x += p.speedX
        p.y += p.speedY

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.fillStyle = `rgba(${secondaryRGB}, 0.4)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.strokeStyle = `rgba(${primaryRGB}, ${(100 - dist) / 100 * 0.08})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      })

      animFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0">
        <div
          ref={(ref) => (blobRefs.current[0] = ref)}
          className="absolute top-0 -left-4 md:w-96 md:h-96 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20 "
        />
        <div
          ref={(ref) => (blobRefs.current[1] = ref)}
          className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20 hidden sm:block"
        />
        <div
          ref={(ref) => (blobRefs.current[2] = ref)}
          className="absolute -bottom-8 left-[-40%] md:left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20 "
        />
        <div
          ref={(ref) => (blobRefs.current[3] = ref)}
          className="absolute -bottom-10 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 md:opacity-10 hidden sm:block"
        />
      </div>
      
      <canvas ref={canvasRef} className="absolute inset-0 block" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:24px_24px]" />
    </div>
  )
}

export default AnimatedBackground
