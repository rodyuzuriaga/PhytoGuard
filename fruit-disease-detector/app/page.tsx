"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Camera,
  Upload,
  Loader2,
  Leaf,
  AlertCircle,
  ChevronRight,
  BarChart3,
  Settings,
  Info,
  ExternalLink,
  MapPin,
  Cloud,
  Droplets,
  ThermometerSun,
  Wind,
  Clock,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface FruitAnalysisResult {
  fruta: string
  estado: string
  enfermedad: string | null
  tipo: "Fungus" | "Virus" | "Mite" | "Bacteria" | "Insect" | "Deficiency" | null
  descripcion: string | null
  link: string | null
  recomendaciones?: string[]
}

interface WeatherInfo {
  location: string
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
  sprayingCondition: "Optimal" | "Acceptable" | "Not Recommended"
  optimalHours: string
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<FruitAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState("inicio")

  // Mock weather data
  const weatherInfo: WeatherInfo = {
    location: "Valle Central, Región Agrícola",
    temperature: 24,
    humidity: 65,
    windSpeed: 8,
    condition: "Parcialmente nublado",
    sprayingCondition: "Optimal",
    optimalHours: "Hasta las 10:00 AM",
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingProgress((prev) => {
          const newProgress = prev + Math.random() * 15
          return newProgress > 90 ? 90 : newProgress
        })
      }, 300)
    } else {
      setLoadingProgress(0)
    }

    return () => clearInterval(interval)
  }, [isAnalyzing])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
        setResult(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const captureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      setTimeout(() => {
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

        const tracks = stream.getTracks()
        tracks.forEach((track) => track.stop())

        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setSelectedImage(imageDataUrl)
        setResult(null)
        setError(null)
      }, 500)
    } catch (err) {
      setError("No se pudo acceder a la cámara. Por favor verifica los permisos.")
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)
    setLoadingProgress(0)

    try {
      // In a real application, you would send the image to your API
      // For demo purposes, we'll simulate a response after a delay
      setTimeout(() => {
        // This is a mock response - in production, replace with actual API call
        const mockResult: FruitAnalysisResult = {
          fruta: "Manzana",
          estado: "Madura",
          enfermedad: "Sarna del manzano",
          tipo: "Fungus",
          descripcion:
            "La sarna del manzano es una enfermedad fúngica causada por Venturia inaequalis. Se caracteriza por lesiones oscuras y escamosas en la superficie de la fruta.",
          link: "https://www.example.com/apple-scab",
          recomendaciones: [
            "Aplicar fungicidas preventivos al inicio de la temporada",
            "Podar y destruir hojas infectadas para reducir la fuente de inóculo",
            "Mantener buena circulación de aire en el huerto",
          ],
        }

        setLoadingProgress(100)
        setTimeout(() => {
          setResult(mockResult)
          setIsAnalyzing(false)
        }, 500)
      }, 2500)

      // Actual API call would look something like this:
      /*
      const response = await fetch('/api/analyze-fruit', {
        method: 'POST',
        body: JSON.stringify({ image: selectedImage }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }
      
      const result = await response.json();
      setResult(result);
      */
    } catch (err) {
      setError("No se pudo analizar la imagen. Por favor intenta de nuevo.")
      setIsAnalyzing(false)
    }
  }

  const renderHomeTab = () => (
    <section className="container mx-auto py-8 px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <Badge
            variant="outline"
            className="mb-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700"
          >
            Tecnología de Vanguardia
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-green-800 dark:text-green-200">
            Diagnóstico de Enfermedades en Frutas con IA
          </h1>
          <p className="text-lg text-green-700 dark:text-green-300 mb-8">
            AgroScan AI utiliza redes neuronales avanzadas para ayudar a los agricultores del valle a identificar
            enfermedades, clasificar el estado de sus frutas y recibir recomendaciones personalizadas.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center justify-center bg-white/30 dark:bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-green-200 dark:border-green-800">
              <div className="mr-2 bg-green-100 dark:bg-green-800 p-1 rounded">
                <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-green-700 dark:text-green-300">Precisión del 98.7%</span>
            </div>
            <div className="flex items-center justify-center bg-white/30 dark:bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-green-200 dark:border-green-800">
              <div className="mr-2 bg-green-100 dark:bg-green-800 p-1 rounded">
                <Camera className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-green-700 dark:text-green-300">Análisis en tiempo real</span>
            </div>
            <div className="flex items-center justify-center bg-white/30 dark:bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 border border-green-200 dark:border-green-800">
              <div className="mr-2 bg-green-100 dark:bg-green-800 p-1 rounded">
                <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-green-700 dark:text-green-300">+50 enfermedades detectables</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="text-lg py-6 px-8 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 dark:from-green-500 dark:to-emerald-400"
              onClick={() => setActiveTab("aplicacion")}
            >
              <Camera className="mr-2 h-5 w-5" />
              Probar Ahora
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg py-6 px-8 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30"
              onClick={() => setActiveTab("tecnologia")}
            >
              <Info className="mr-2 h-5 w-5" />
              Conocer Más
            </Button>
          </div>
        </div>

        <div className="order-1 lg:order-2 flex justify-center">
          <div className="relative w-full max-w-md aspect-square">
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="Agricultor usando AgroScan AI"
              width={600}
              height={600}
              className="rounded-2xl shadow-xl object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 max-w-xs">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                  <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800 dark:text-green-300">Diagnóstico Instantáneo</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Resultados precisos en segundos para tomar decisiones informadas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mt-20">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-green-200 dark:border-green-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Precisión del Modelo</h3>
            <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
              <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">98.7%</p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Nuestro modelo de IA ha sido entrenado con más de 500,000 imágenes de frutas para garantizar resultados
            precisos.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-green-200 dark:border-green-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Enfermedades Detectables</h3>
            <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
              <AlertCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">50+</p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Detectamos más de 50 enfermedades comunes en frutas cultivadas en el valle, con actualizaciones constantes.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-green-200 dark:border-green-800 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Agricultores Beneficiados</h3>
            <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
              <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">1,200+</p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Más de 1,200 agricultores ya utilizan nuestra tecnología para mejorar la calidad de sus cultivos.
          </p>
        </div>
      </div>
    </section>
  )

  const renderAppTab = () => (
    <section className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Left Column - Input Controls */}
        <div className="md:col-span-1 lg:col-span-3 flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-2xl text-green-800 dark:text-green-300">
                  Detector de Enfermedades
                </CardTitle>
                <CardDescription className="text-center text-green-600 dark:text-green-400">
                  Analiza tus frutas con inteligencia artificial
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <Tabs defaultValue="upload" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-green-100 dark:bg-green-800/40">
                    <TabsTrigger
                      value="upload"
                      className="text-lg py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-300"
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      Subir
                    </TabsTrigger>
                    <TabsTrigger
                      value="camera"
                      className="text-lg py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-green-700 dark:data-[state=active]:text-green-300"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Cámara
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upload" className="mt-0">
                    <div className="flex flex-col items-center gap-4">
                      <label
                        htmlFor="image-upload"
                        className="border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg p-8 w-full text-center cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                      >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Upload className="mx-auto h-12 w-12 text-green-500 dark:text-green-400 mb-2" />
                          <p className="text-lg font-medium text-green-800 dark:text-green-300">
                            Haz clic para subir una imagen
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-500">o arrastra y suelta</p>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                        </motion.div>
                      </label>
                    </div>
                  </TabsContent>

                  <TabsContent value="camera" className="mt-0">
                    <div className="flex flex-col items-center gap-4">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                        <Button
                          size="lg"
                          className="w-full text-lg py-6 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 dark:from-green-500 dark:to-emerald-400"
                          onClick={captureImage}
                        >
                          <Camera className="mr-2 h-6 w-6" />
                          Tomar Foto
                        </Button>
                      </motion.div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                {selectedImage && (
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                    <Button
                      size="lg"
                      className="w-full text-lg py-6 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 dark:from-green-500 dark:to-emerald-400"
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <span className="flex items-center">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analizando...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Leaf className="mr-2 h-5 w-5" />
                          Analizar Imagen
                        </span>
                      )}
                    </Button>
                  </motion.div>
                )}

                {isAnalyzing && (
                  <div className="w-full">
                    <div className="h-2 w-full bg-green-100 dark:bg-green-900 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                        initial={{ width: "0%" }}
                        animate={{ width: `${loadingProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="text-xs text-center mt-1 text-green-600 dark:text-green-400">
                      {loadingProgress < 30
                        ? "Procesando imagen..."
                        : loadingProgress < 60
                          ? "Identificando fruta..."
                          : loadingProgress < 90
                            ? "Analizando condición..."
                            : "Finalizando análisis..."}
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>
          </motion.div>

          {/* Weather and Location Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-green-800 dark:text-green-300 flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                    Ubicación y Clima
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-sm font-medium">{weatherInfo.location}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700"
                  >
                    Actualizado
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <ThermometerSun className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-sm">{weatherInfo.temperature}°C</span>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-sm">{weatherInfo.humidity}% Humedad</span>
                  </div>
                  <div className="flex items-center">
                    <Wind className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-sm">{weatherInfo.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center">
                    <Cloud className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-sm">{weatherInfo.condition}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2 flex items-center">
                    <Droplets className="h-4 w-4 mr-2" />
                    Condiciones de Pulverización
                  </h4>
                  <div
                    className={`rounded-lg p-2 mb-2 flex items-center ${
                      weatherInfo.sprayingCondition === "Optimal"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        : weatherInfo.sprayingCondition === "Acceptable"
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    }`}
                  >
                    {weatherInfo.sprayingCondition === "Optimal" && (
                      <span className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        Condiciones Óptimas
                      </span>
                    )}
                    {weatherInfo.sprayingCondition === "Acceptable" && (
                      <span className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                        Condiciones Aceptables
                      </span>
                    )}
                    {weatherInfo.sprayingCondition === "Not Recommended" && (
                      <span className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                        No Recomendado
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Horario óptimo: {weatherInfo.optimalHours}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Middle Column - Image Preview and Disease Library */}
        <div className="md:col-span-1 lg:col-span-4 flex flex-col gap-6">
          <AnimatePresence>
            {selectedImage ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-green-800 dark:text-green-300">Imagen Seleccionada</CardTitle>
                    <CardDescription className="text-green-600 dark:text-green-400">
                      Vista previa de la fruta a analizar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center p-4">
                    <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden border-2 border-green-200 dark:border-green-800">
                      <Image
                        src={selectedImage || "/placeholder.svg"}
                        alt="Fruta seleccionada"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg flex flex-col justify-center items-center p-8 min-h-[320px]">
                  <div className="text-center">
                    <div className="bg-green-100 dark:bg-green-800 p-4 rounded-full inline-block mb-4">
                      <Camera className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-medium text-green-800 dark:text-green-300 mb-2">
                      Ninguna imagen seleccionada
                    </h3>
                    <p className="text-green-600 dark:text-green-400 max-w-xs mx-auto">
                      Sube o captura una imagen de una fruta para comenzar el análisis con nuestra red neuronal.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Disease Library Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-800 dark:text-green-300 flex items-center">
                  <Search className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                  Biblioteca de Enfermedades
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">
                  Explora por tipo de patógeno
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="justify-start border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
                  >
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    Fungus
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
                  >
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    Virus
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
                  >
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    Mite
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    Bacteria
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
                  >
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    Insect
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30"
                  >
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    Deficiency
                  </Button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar enfermedad..."
                    className="w-full px-4 py-2 rounded-md border border-green-200 dark:border-green-800 bg-white/50 dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Results and Recent Diagnoses */}
        <div className="md:col-span-2 lg:col-span-5 flex flex-col gap-6">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-red-200 bg-red-50/80 backdrop-blur-sm dark:bg-red-950/30 dark:border-red-800">
                  <CardContent className="pt-6 flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-400" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-green-800 dark:text-green-300 flex items-center">
                        <Leaf className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                        Resultados del Análisis
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={
                          result.enfermedad
                            ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700"
                            : "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700"
                        }
                      >
                        {result.enfermedad ? "Enfermedad Detectada" : "Fruta Saludable"}
                      </Badge>
                    </div>
                    <CardDescription className="text-green-600 dark:text-green-400">
                      Análisis completado con IA
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-lg">
                      <div className="font-semibold text-green-800 dark:text-green-300">Fruta:</div>
                      <div className="font-medium">{result.fruta}</div>

                      <div className="font-semibold text-green-800 dark:text-green-300">Estado:</div>
                      <div
                        className={
                          result.estado === "Fresca" || result.estado === "Madura"
                            ? "text-emerald-600 dark:text-emerald-400 font-medium"
                            : "text-red-600 dark:text-red-400 font-medium"
                        }
                      >
                        {result.estado}
                        {(result.estado === "Fresca" || result.estado === "Madura") && (
                          <span className="ml-2 inline-block">✓</span>
                        )}
                      </div>
                    </div>

                    {result.enfermedad && (
                      <>
                        <Separator className="my-2" />

                        <div>
                          <h4 className="font-semibold text-lg text-amber-700 dark:text-amber-400 mb-2 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Enfermedad Detectada
                          </h4>
                          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-3">
                            <div className="flex justify-between items-center">
                              <p className="font-medium text-amber-800 dark:text-amber-300">{result.enfermedad}</p>
                              {result.tipo && (
                                <Badge
                                  variant="outline"
                                  className={
                                    result.tipo === "Fungus"
                                      ? "bg-amber-100/50 text-amber-800 border-amber-300"
                                      : result.tipo === "Virus"
                                        ? "bg-red-100/50 text-red-800 border-red-300"
                                        : result.tipo === "Mite"
                                          ? "bg-purple-100/50 text-purple-800 border-purple-300"
                                          : result.tipo === "Bacteria"
                                            ? "bg-blue-100/50 text-blue-800 border-blue-300"
                                            : result.tipo === "Insect"
                                              ? "bg-green-100/50 text-green-800 border-green-300"
                                              : "bg-yellow-100/50 text-yellow-800 border-yellow-300"
                                  }
                                >
                                  {result.tipo}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-green-700 dark:text-green-300 mb-3">{result.descripcion}</p>

                          {result.recomendaciones && result.recomendaciones.length > 0 && (
                            <div className="mt-4">
                              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                                Recomendaciones:
                              </h4>
                              <ul className="space-y-2">
                                {result.recomendaciones.map((rec, index) => (
                                  <li key={index} className="flex items-start">
                                    <ChevronRight className="h-4 w-4 text-green-600 dark:text-green-400 mt-1 mr-2 flex-shrink-0" />
                                    <span className="text-sm">{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>

                  {result.link && (
                    <CardFooter>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30"
                          asChild
                        >
                          <a
                            href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Información Científica Detallada
                          </a>
                        </Button>
                      </motion.div>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg flex flex-col justify-center items-center p-8 min-h-[320px]">
                  <div className="text-center">
                    <div className="bg-green-100 dark:bg-green-800 p-4 rounded-full inline-block mb-4">
                      <BarChart3 className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-medium text-green-800 dark:text-green-300 mb-2">Esperando análisis</h3>
                    <p className="text-green-600 dark:text-green-400 max-w-xs mx-auto">
                      Selecciona una imagen y presiona el botón "Analizar Imagen" para obtener resultados detallados.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Diagnoses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-800 dark:text-green-300 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                  Diagnósticos Recientes
                </CardTitle>
                <CardDescription className="text-green-600 dark:text-green-400">Historial de análisis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <Image src="/placeholder.svg?height=48&width=48" alt="Manzana" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-green-800 dark:text-green-300 truncate">Manzana</h4>
                        <span className="text-xs text-green-600 dark:text-green-400">Hace 2h</span>
                      </div>
                      <p className="text-sm text-amber-600 dark:text-amber-400 truncate">Sarna del manzano</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <Image src="/placeholder.svg?height=48&width=48" alt="Naranja" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-green-800 dark:text-green-300 truncate">Naranja</h4>
                        <span className="text-xs text-green-600 dark:text-green-400">Ayer</span>
                      </div>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 truncate">Saludable</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                      <Image src="/placeholder.svg?height=48&width=48" alt="Uva" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-green-800 dark:text-green-300 truncate">Uva</h4>
                        <span className="text-xs text-green-600 dark:text-green-400">Hace 3d</span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400 truncate">Mildiu polvoriento</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )

  const renderTechTab = () => (
    <section className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <Badge
          variant="outline"
          className="mb-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700"
        >
          Nuestra Tecnología
        </Badge>
        <h2 className="text-3xl font-bold mb-4 text-green-800 dark:text-green-200">
          Redes Neuronales Convolucionales Avanzadas
        </h2>
        <p className="text-lg text-green-700 dark:text-green-300">
          Utilizamos modelos de aprendizaje profundo especializados para el análisis de imágenes de frutas con alta
          precisión.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-300">Detección de Enfermedades</CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              Identificación precisa de patologías
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Nuestro algoritmo puede detectar más de 50 enfermedades comunes en frutas, incluyendo hongos, bacterias y
              deficiencias nutricionales, con una precisión superior al 98%.
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-300">Clasificación de Madurez</CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              Evaluación del estado de la fruta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              El sistema clasifica automáticamente las frutas según su estado de madurez, permitiendo a los agricultores
              optimizar los tiempos de cosecha y reducir pérdidas.
            </p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-300">Recomendaciones Personalizadas</CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              Soluciones basadas en evidencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Proporcionamos recomendaciones específicas para el tratamiento de enfermedades y optimización de cultivos,
              basadas en investigaciones científicas actualizadas.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-green-200 dark:border-green-800 rounded-xl p-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-200">
              Arquitectura de la Red Neuronal
            </h3>
            <p className="text-green-700 dark:text-green-300 mb-4">
              Nuestra red neuronal convolucional (CNN) utiliza una arquitectura de vanguardia basada en EfficientNet,
              optimizada específicamente para la identificación de enfermedades en frutas.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>Más de 150 capas convolucionales para extracción de características</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>Entrenada con más de 500,000 imágenes de frutas etiquetadas</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>Optimización continua mediante aprendizaje por transferencia</span>
              </li>
              <li className="flex items-start">
                <ChevronRight className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>Técnicas de aumento de datos para mejorar la robustez</span>
              </li>
            </ul>
          </div>
          <div className="relative h-64 md:h-auto">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Arquitectura de la red neuronal"
              width={600}
              height={400}
              className="rounded-lg shadow-md object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )

  const renderCommunityTab = () => (
    <section className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <Badge
          variant="outline"
          className="mb-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700"
        >
          Comunidad AgroScan
        </Badge>
        <h2 className="text-3xl font-bold mb-4 text-green-800 dark:text-green-200">
          Conecta con Agricultores del Valle
        </h2>
        <p className="text-lg text-green-700 dark:text-green-300">
          Comparte experiencias, aprende de otros agricultores y accede a conocimiento colectivo sobre cultivos y
          enfermedades.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-300">Publicaciones Recientes</CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Actualizaciones de la comunidad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Post 1 */}
              <div className="border-b border-green-200 dark:border-green-800 pb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                    <span className="font-medium text-green-700 dark:text-green-300">JR</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-300">Juan Rodríguez</h4>
                    <p className="text-xs text-green-600 dark:text-green-400">Hace 2 horas</p>
                  </div>
                </div>
                <p className="text-sm mb-3">
                  He notado un aumento de la sarna del manzano en mi huerto este año. ¿Alguien más está experimentando
                  lo mismo? AgroScan me ha ayudado a identificarlo temprano.
                </p>
                <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3">
                  <Image
                    src="/placeholder.svg?height=160&width=400"
                    alt="Manzanas con sarna"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center gap-4 text-sm text-green-600 dark:text-green-400">
                  <button className="flex items-center gap-1 hover:text-green-800 dark:hover:text-green-200 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-heart"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    <span>12 Me gusta</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-800 dark:hover:text-green-200 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-message-square"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>8 Comentarios</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-800 dark:hover:text-green-200 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-share"
                    >
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" x2="12" y1="2" y2="15" />
                    </svg>
                    <span>Compartir</span>
                  </button>
                </div>
              </div>

              {/* Post 2 */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                    <span className="font-medium text-green-700 dark:text-green-300">ML</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 dark:text-green-300">María López</h4>
                    <p className="text-xs text-green-600 dark:text-green-400">Ayer</p>
                  </div>
                </div>
                <p className="text-sm mb-3">
                  ¡Gracias a todos por sus consejos sobre el control de plagas orgánico! Implementé las recomendaciones
                  de AgroScan y los resultados han sido excelentes. Aquí les comparto algunas fotos de mis naranjas.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=128&width=200"
                      alt="Naranjas saludables"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=128&width=200"
                      alt="Árbol de naranjas"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-green-600 dark:text-green-400">
                  <button className="flex items-center gap-1 hover:text-green-800 dark:hover:text-green-200 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-heart"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                    <span>24 Me gusta</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-800 dark:hover:text-green-200 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-message-square"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>15 Comentarios</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-green-800 dark:hover:text-green-200 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-share"
                    >
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" x2="12" y1="2" y2="15" />
                    </svg>
                    <span>Compartir</span>
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 dark:from-green-500 dark:to-emerald-400">
                Ver Más Publicaciones
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-300">Eventos Próximos</CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">Talleres y encuentros</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-green-500 pl-3 py-1">
                <h4 className="font-medium text-green-800 dark:text-green-300">Taller de Control de Plagas</h4>
                <p className="text-sm text-green-600 dark:text-green-400">15 de Mayo, 10:00 AM</p>
                <p className="text-xs">Centro Comunitario del Valle</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-3 py-1">
                <h4 className="font-medium text-green-800 dark:text-green-300">Feria Agrícola Anual</h4>
                <p className="text-sm text-green-600 dark:text-green-400">22-24 de Mayo</p>
                <p className="text-xs">Parque Central</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-3 py-1">
                <h4 className="font-medium text-green-800 dark:text-green-300">Webinar: Nuevas Tecnologías</h4>
                <p className="text-sm text-green-600 dark:text-green-400">30 de Mayo, 7:00 PM</p>
                <p className="text-xs">Online (Zoom)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-300">Expertos Destacados</CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">Asesores de la comunidad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                  <span className="font-medium text-green-700 dark:text-green-300">DR</span>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300">Dr. Roberto Méndez</h4>
                  <p className="text-xs text-green-600 dark:text-green-400">Fitopatólogo</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                  <span className="font-medium text-green-700 dark:text-green-300">LG</span>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300">Ing. Laura Gómez</h4>
                  <p className="text-xs text-green-600 dark:text-green-400">Agrónoma</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                  <span className="font-medium text-green-700 dark:text-green-300">CS</span>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300">Carlos Sánchez</h4>
                  <p className="text-xs text-green-600 dark:text-green-400">Agricultor Experto</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )

  const renderDiagnosticsTab = () => (
    <section className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <Badge
          variant="outline"
          className="mb-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700"
        >
          Mis Diagnósticos
        </Badge>
        <h2 className="text-3xl font-bold mb-4 text-green-800 dark:text-green-200">Historial de Análisis</h2>
        <p className="text-lg text-green-700 dark:text-green-300">
          Revisa y gestiona todos tus diagnósticos anteriores
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-green-800 dark:text-green-300">Diagnósticos Recientes</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                  >
                    Filtrar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                  >
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Diagnosis 1 */}
                <div className="border border-green-200 dark:border-green-800 rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-32 h-32 md:h-auto">
                      <Image
                        src="/placeholder.svg?height=128&width=128"
                        alt="Manzana con sarna"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-300">Manzana</h4>
                          <p className="text-sm text-amber-600 dark:text-amber-400">Sarna del manzano (Fungus)</p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700"
                        >
                          Enfermedad Detectada
                        </Badge>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                        Analizado el 5 de Mayo, 2025 - 10:23 AM
                      </p>
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                        >
                          Ver Detalles
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                          <button className="hover:text-green-800 dark:hover:text-green-200 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-share"
                            >
                              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                              <polyline points="16 6 12 2 8 6" />
                              <line x1="12" x2="12" y1="2" y2="15" />
                            </svg>
                          </button>
                          <button className="hover:text-green-800 dark:hover:text-green-200 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-trash-2"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diagnosis 2 */}
                <div className="border border-green-200 dark:border-green-800 rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-32 h-32 md:h-auto">
                      <Image
                        src="/placeholder.svg?height=128&width=128"
                        alt="Naranja saludable"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-300">Naranja</h4>
                          <p className="text-sm text-emerald-600 dark:text-emerald-400">Saludable</p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700"
                        >
                          Fruta Saludable
                        </Badge>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                        Analizado el 4 de Mayo, 2025 - 3:45 PM
                      </p>
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                        >
                          Ver Detalles
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                          <button className="hover:text-green-800 dark:hover:text-green-200 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-share"
                            >
                              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                              <polyline points="16 6 12 2 8 6" />
                              <line x1="12" x2="12" y1="2" y2="15" />
                            </svg>
                          </button>
                          <button className="hover:text-green-800 dark:hover:text-green-200 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-trash-2"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Diagnosis 3 */}
                <div className="border border-green-200 dark:border-green-800 rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-32 h-32 md:h-auto">
                      <Image
                        src="/placeholder.svg?height=128&width=128"
                        alt="Uva con mildiu"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-300">Uva</h4>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Mildiu polvoriento (Fungus)</p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700"
                        >
                          Enfermedad Detectada
                        </Badge>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                        Analizado el 2 de Mayo, 2025 - 9:12 AM
                      </p>
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
                        >
                          Ver Detalles
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                          <button className="hover:text-green-800 dark:hover:text-green-200 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-share"
                            >
                              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                              <polyline points="16 6 12 2 8 6" />
                              <line x1="12" x2="12" y1="2" y2="15" />
                            </svg>
                          </button>
                          <button className="hover:text-green-800 dark:hover:text-green-200 transition-colors">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-trash-2"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              <line x1="10" x2="10" y1="11" y2="17" />
                              <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 dark:from-green-500 dark:to-emerald-400">
                Cargar Más Diagnósticos
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-300">Estadísticas</CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">Resumen de diagnósticos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Total de Diagnósticos</p>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-300">24</p>
                </div>
                <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                  <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Frutas Saludables</p>
                  <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300">15</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <p className="text-sm text-amber-600 dark:text-amber-400">Con Enfermedades</p>
                  <p className="text-xl font-bold text-amber-800 dark:text-amber-300">9</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">Tipos de Patógenos</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400 min-w-[35px]">65%</span>
                    <span className="text-xs ml-2">Fungus</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400 min-w-[35px]">15%</span>
                    <span className="text-xs ml-2">Bacteria</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400 min-w-[35px]">10%</span>
                    <span className="text-xs ml-2">Insect</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400 min-w-[35px]">10%</span>
                    <span className="text-xs ml-2">Deficiency</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-green-200 dark:border-green-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-300">Exportar Datos</CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Descarga tus diagnósticos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-file-text mr-2"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" x2="8" y1="13" y2="13" />
                  <line x1="16" x2="8" y1="17" y2="17" />
                  <line x1="10" x2="8" y1="9" y2="9" />
                </svg>
                Exportar como CSV
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-file-json mr-2"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" />
                  <path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" />
                </svg>
                Exportar como JSON
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-file-bar-chart mr-2"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="10" x2="10" y1="13" y2="17" />
                  <line x1="14" x2="14" y1="13" y2="17" />
                  <line x1="18" x2="18" y1="13" y2="17" />
                </svg>
                Informe de Análisis PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-green-200 dark:border-green-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-2 rounded-md">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300">
                AgroScan AI
              </h1>
              <p className="text-xs text-green-600 dark:text-green-400">Inteligencia Artificial para Agricultura</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setActiveTab("inicio")}
              className={`text-sm font-medium ${
                activeTab === "inicio"
                  ? "text-green-700 dark:text-green-300"
                  : "text-green-600/70 dark:text-green-400/70 hover:text-green-900 dark:hover:text-green-100"
              } transition-colors`}
            >
              Inicio
            </button>
            <button
              onClick={() => setActiveTab("aplicacion")}
              className={`text-sm font-medium ${
                activeTab === "aplicacion"
                  ? "text-green-700 dark:text-green-300"
                  : "text-green-600/70 dark:text-green-400/70 hover:text-green-900 dark:hover:text-green-100"
              } transition-colors`}
            >
              Aplicación
            </button>
            <button
              onClick={() => setActiveTab("tecnologia")}
              className={`text-sm font-medium ${
                activeTab === "tecnologia"
                  ? "text-green-700 dark:text-green-300"
                  : "text-green-600/70 dark:text-green-400/70 hover:text-green-900 dark:hover:text-green-100"
              } transition-colors`}
            >
              Tecnología
            </button>
            <button
              onClick={() => setActiveTab("comunidad")}
              className={`text-sm font-medium ${
                activeTab === "comunidad"
                  ? "text-green-700 dark:text-green-300"
                  : "text-green-600/70 dark:text-green-400/70 hover:text-green-900 dark:hover:text-green-100"
              } transition-colors`}
            >
              Comunidad
            </button>
            <button
              onClick={() => setActiveTab("diagnosticos")}
              className={`text-sm font-medium ${
                activeTab === "diagnosticos"
                  ? "text-green-700 dark:text-green-300"
                  : "text-green-600/70 dark:text-green-400/70 hover:text-green-900 dark:hover:text-green-100"
              } transition-colors`}
            >
              Mis Diagnósticos
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="hidden md:flex bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700"
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Demo para Inversores
            </Badge>
            <Button variant="ghost" size="icon" className="text-green-700 dark:text-green-300">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {activeTab === "inicio" && renderHomeTab()}
      {activeTab === "aplicacion" && renderAppTab()}
      {activeTab === "tecnologia" && renderTechTab()}
      {activeTab === "comunidad" && renderCommunityTab()}
      {activeTab === "diagnosticos" && renderDiagnosticsTab()}

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-green-200 dark:border-green-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-2 rounded-md">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300">
                  AgroScan AI
                </h1>
                <p className="text-xs text-green-600 dark:text-green-400">© 2025 AgroScan Technologies</p>
              </div>
            </div>

            <div className="flex gap-6">
              <Link
                href="#"
                className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
              >
                Términos de Uso
              </Link>
              <Link
                href="#"
                className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
              >
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
