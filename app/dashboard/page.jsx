"use client"
import React, {useState, useEffect} from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/@/components/ui/card'
import { PlusCircle, Home } from 'lucide-react'
import { Skeleton } from '@/@/components/ui/skeleton'

export default function Dashboard() {
  const [households, setHouseholds] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        const response = await fetch('/api/household')
        const data = await response.json()
        setHouseholds(data)
      } catch (error) {
        console.error('Error fetching households:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHouseholds()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Households</h1>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Households</h1>
          <p className="text-muted-foreground">Manage your shared living spaces and expenses</p>
        </div>
        <Link href="/dashboard/household/create">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Household
          </Button>
        </Link>
      </div>

      {households.length === 0 ? (
        <Card>
          <CardHeader>
            <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
              <Home className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium">No households yet</h3>
                <p className="text-sm text-muted-foreground">
                  Get started by creating a new household.
                </p>
              </div>
              <Link href="/dashboard/household/create">
                <Button className="mt-4" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Household
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {households.map((household) => (
            <Link key={household.id} href={`/dashboard/household/${household.id}`}>
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{household.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {household.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {household.memberCount || 0} members • {household.expenseCount || 0} expenses
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}