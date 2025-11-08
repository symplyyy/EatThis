import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function RecipeCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden animate-pulse">
      <div className="relative w-full h-48 sm:h-56 md:h-64 bg-muted rounded-t-2xl" />
      <CardHeader className="pb-3 sm:pb-4">
        <div className="h-6 bg-muted rounded-lg w-3/4 mb-2" />
        <div className="h-4 bg-muted rounded-lg w-1/2" />
        <div className="flex gap-3 mt-2">
          <div className="h-5 bg-muted rounded-full w-16" />
          <div className="h-5 bg-muted rounded-full w-20" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0 pb-4 sm:pb-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-muted rounded w-32" />
            <div className="h-6 bg-muted rounded w-8" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 bg-muted rounded w-36" />
            <div className="h-6 bg-muted rounded w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

