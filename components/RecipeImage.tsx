'use client'

import Image from 'next/image'
import { ImageIcon } from 'lucide-react'
import { useState } from 'react'

interface RecipeImageProps {
  src: string | null | undefined
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
  fill?: boolean
  width?: number
  height?: number
}

export function RecipeImage({ 
  src, 
  alt, 
  className = '', 
  sizes,
  priority = false,
  fill = false,
  width,
  height
}: RecipeImageProps) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div className={`relative ${fill ? 'absolute inset-0' : ''} ${!fill && width && height ? `w-[${width}px] h-[${height}px]` : ''} bg-muted flex items-center justify-center ${className}`}>
        <div className="text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground/70">Aucune image</p>
        </div>
      </div>
    )
  }

  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          sizes={sizes}
          priority={priority}
          onError={() => setHasError(true)}
        />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setHasError(true)}
    />
  )
}

