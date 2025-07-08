"use client"
import React, {useState, useEffect} from 'react'
import {useParams, useRouter} from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/@/components/ui/card'
import { PlusCircle, Users, DollarSign, Calendar, User, ArrowLeft, Search, X } from 'lucide-react'
import { Skeleton } from '@/@/components/ui/skeleton'
import { Badge } from '@/@/components/ui/badge'
import { Input } from '@/@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/@/components/ui/dialog'


export default function HouseholdPage() {
    const {id} = useParams()
    const router = useRouter()
    const [household, setHousehold] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
    const [userId, setUserId] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [searchEmail, setSearchEmail] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)

    const fetchHousehold = async () => {
        try {
            const response = await fetch(`/api/household/${id}`)
            const data = await response.json()
            setHousehold(data)
        } catch (error) {
            console.error('Error fetching household:', error)
            toast.error('Failed to load household data')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchHousehold()
    }, [id])

    const handleSearchUser = async (e) => {
        e.preventDefault()
        if (!searchEmail.trim()) return
        
        setIsSearching(true)
        try {
            const response = await fetch(`/api/user/search?email=${encodeURIComponent(searchEmail)}`)
            if (!response.ok) throw new Error('Failed to search for user')
            const data = await response.json()
            setSearchResults(data)
        } catch (error) {
            console.error('Error searching user:', error)
            toast.error('Failed to search for user')
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }

    const handleAddMember = async (e) => {
        e.preventDefault()
        if (!userId.trim()) {
            toast.error('Please enter a user ID')
            return
        }

        setIsAdding(true)
        try {
            const response = await fetch('/api/household/add-member', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, householdId: id })
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to add member')
            }
            
            toast.success('Member added successfully')
            setUserId('')
            fetchHousehold() // Refresh household data
            setIsAddMemberOpen(false)
        } catch (error) {
            console.error('Error adding member:', error)
            toast.error(error.message || 'Failed to add member')
        } finally {
            setIsAdding(false)
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 max-w-6xl">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid gap-6">
                    <Skeleton className="h-12 w-full" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!household) {
        return (
            <div className="container mx-auto p-6 max-w-6xl">
                <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
                <div className="text-center py-12">
                    <h2 className="text-xl font-medium">Household not found</h2>
                    <p className="text-muted-foreground mt-2">The requested household could not be loaded.</p>
                </div>
            </div>
        )
    }

    const totalExpenses = household.expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount), 0) || 0
    const averageExpense = household.expenses?.length ? totalExpenses / household.expenses.length : 0
    const memberIds = new Set(household.members?.map(m => m.userId) || [])

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">{household.name}</h1>
                    {household.description && (
                        <p className="text-muted-foreground">{household.description}</p>
                    )}
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                        variant="outline" 
                        className="gap-2 w-full sm:w-auto"
                        onClick={() => setIsAddMemberOpen(true)}
                    >
                        <User className="h-4 w-4" />
                        Add Member
                    </Button>
                    <Link href={`/dashboard/household/${id}/add-expense`} className="w-full sm:w-auto">
                        <Button className="gap-2 w-full sm:w-auto">
                            <PlusCircle className="h-4 w-4" />
                            Add Expense
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Add Member Dialog */}
            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Member</DialogTitle>
                        <DialogDescription>
                            Enter the user ID to add them to this household.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddMember} className="space-y-4">
                        <div>
                            <Input
                                type="text"
                                placeholder="Enter User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                disabled={isAdding}
                            />
                        </div>
                        <Button 
                            type="submit" 
                            disabled={isAdding || !userId.trim()} 
                            className="w-full"
                        >
                            {isAdding ? 'Adding...' : 'Add Member'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="grid gap-6">
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">
                                {household.expenses?.length || 0} expense{household.expenses?.length !== 1 ? 's' : ''}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${averageExpense.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">
                                per expense
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Members</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{household.members?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {household.members?.slice(0, 3).map(m => m.user.name).join(', ')}
                                {household.members?.length > 3 ? ` +${household.members.length - 3} more` : ''}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Recent Expenses</h2>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                            View all
                        </Link>
                    </div>

                    {household.expenses?.length ? (
                        <div className="space-y-4">
                            {household.expenses.map((expense) => (
                                <Card key={expense.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{expense.description}</h3>
                                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                    <User className="h-3 w-3 mr-1" />
                                                    {expense.paidBy?.name || 'Unknown'}
                                                    <span className="mx-2">•</span>
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {new Date(expense.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">${parseFloat(expense.amount).toFixed(2)}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {expense.splitType === 'EQUAL' ? 'Split equally' : 'Custom split'}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium">No expenses yet</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Add your first expense to get started
                                </p>
                                <Link href={`/dashboard/household/${id}/add-expense`} className="mt-4">
                                    <Button size="sm">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Expense
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}