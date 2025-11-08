'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw, CheckCircle2, Square } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RecipeTimerProps {
  recipeId: number
  timeMinutes: number
  averageTimeMinutes?: number | null
}

export function RecipeTimer({ recipeId, timeMinutes, averageTimeMinutes }: RecipeTimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0) // Temps écoulé en secondes
  const [isStopped, setIsStopped] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  
  // Utiliser le temps moyen si disponible, sinon le temps estimé
  const targetTimeMinutes = averageTimeMinutes || timeMinutes

  useEffect(() => {
    if (isRunning && !isStopped) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now() - elapsedTime * 1000
      }
      
      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const elapsed = Math.floor((now - (startTimeRef.current || now)) / 1000)
        setElapsedTime(elapsed)
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isStopped, elapsedTime])

  const handleStartPause = () => {
    if (isStopped) return
    setIsRunning(!isRunning)
    if (!isRunning) {
      startTimeRef.current = Date.now() - elapsedTime * 1000
    }
  }

  const handleStop = () => {
    if (!isRunning && elapsedTime === 0) return
    
    setIsRunning(false)
    setIsStopped(true)
    // Ne pas enregistrer automatiquement - l'utilisateur choisira
  }

  const handleSaveTime = async () => {
    if (elapsedTime === 0 || isSaved) return
    
    setIsSaving(true)
    try {
      const response = await fetch(`/api/recipes/${recipeId}/timer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeSeconds: elapsedTime
        })
      })
      
      if (response.ok) {
        setIsSaved(true)
      } else {
        console.error('Erreur lors de l\'enregistrement du temps')
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du temps:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsStopped(false)
    setIsSaved(false)
    setElapsedTime(0)
    startTimeRef.current = null
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const targetSeconds = targetTimeMinutes * 60
  const progress = Math.min((elapsedTime / targetSeconds) * 100, 100)
  const isOverTime = elapsedTime > targetSeconds

  return (
    <Card className="w-full border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 ease-in-out">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">⏱️</span>
          </div>
          <CardTitle className="text-xl font-semibold">
            Chronomètre
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-3">
          <div
            className={`text-6xl sm:text-7xl font-bold mb-4 transition-all duration-300 ease-in-out ${
              isStopped
                ? 'text-green-600 dark:text-green-400'
                : isOverTime
                ? 'text-orange-600 dark:text-orange-400'
                : isRunning
                ? 'text-primary'
                : 'text-foreground'
            }`}
          >
            {formatTime(elapsedTime)}
          </div>
          {isStopped && (
            <div className="flex items-center justify-center gap-2 mb-2">
              {isSaved ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Temps enregistré ! 🎉</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Timer arrêté - Enregistrez le temps si vous avez terminé la recette
                </span>
              )}
            </div>
          )}
          {isOverTime && !isStopped && (
            <div className="text-xs text-orange-600 dark:text-orange-400 mb-2">
              Temps estimé dépassé
            </div>
          )}
        </div>

        {/* Barre de progression améliorée */}
        <div className="relative w-full">
          <div className="w-full bg-muted rounded-full h-6 overflow-hidden shadow-inner border border-border/50">
            <div
              className={`h-full transition-all duration-500 ease-in-out rounded-full relative ${
                isStopped
                  ? 'bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500'
                  : isOverTime
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500'
                  : isRunning
                  ? 'bg-gradient-to-r from-primary via-primary/90 to-primary'
                  : 'bg-gradient-to-r from-muted-foreground/40 to-muted-foreground/30'
              }`}
              style={{ 
                width: `${Math.min(progress, 100)}%`,
                boxShadow: isRunning ? '0 0 20px rgba(142, 76%, 36%, 0.4)' : 'none'
              }}
            >
              {isRunning && (
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              )}
            </div>
          </div>
          {/* Marqueur du temps estimé */}
          {progress < 100 && (
            <div 
              className="absolute top-0 w-1 h-6 bg-foreground/30 rounded-full"
              style={{ left: '100%', transform: 'translateX(-50%)' }}
            />
          )}
        </div>

        {/* Boutons de contrôle */}
        <div className="flex flex-col items-center justify-center gap-3">
          {!isStopped ? (
            <div className="flex items-center justify-center gap-3 w-full">
              <Button
                onClick={handleStartPause}
                variant={isRunning ? 'destructive' : 'default'}
                size="lg"
                className="flex-1 h-12 text-base font-semibold"
              >
                {isRunning ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Démarrer
                  </>
                )}
              </Button>
              <Button
                onClick={handleStop}
                variant="outline"
                size="lg"
                className="h-12 px-4"
                disabled={elapsedTime === 0}
              >
                <Square className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <>
              {!isSaved && (
                <Button
                  onClick={handleSaveTime}
                  variant="default"
                  size="lg"
                  className="w-full h-12 text-base font-semibold"
                  disabled={isSaving || elapsedTime === 0}
                >
                  {isSaving ? (
                    <>
                      <div className="mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Enregistrer le temps
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={handleReset}
                variant={isSaved ? 'default' : 'outline'}
                size="lg"
                className="w-full h-12 text-base font-semibold"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                {isSaved ? 'Nouveau chrono' : 'Recommencer'}
              </Button>
            </>
          )}
        </div>

        <div className="text-xs text-center text-muted-foreground space-y-1">
          <p>
            Temps estimé : {targetTimeMinutes} minute{targetTimeMinutes > 1 ? 's' : ''}
            {averageTimeMinutes && averageTimeMinutes !== timeMinutes && (
              <span className="ml-2 text-primary">
                (moyenne basée sur {averageTimeMinutes !== timeMinutes ? 'les utilisateurs' : ''})
              </span>
            )}
          </p>
          {averageTimeMinutes && (
            <p className="text-xs opacity-70">
              Temps de base : {timeMinutes} min
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

