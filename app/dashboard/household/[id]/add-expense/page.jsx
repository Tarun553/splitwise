"use client"

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";


// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/@/components/ui/input";
import { Label } from "@/@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/@/components/ui/select";
import { Checkbox } from "@/@/components/ui/checkbox";

// Form validation schema
const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Amount must be a positive number"
  ),
  paidBy: z.string().min(1, "Payer is required"),
  splitType: z.enum(["EQUAL", "CUSTOM"]).default("EQUAL"),
  splits: z.record(z.string(), z.boolean()).optional()
});

export default function AddExpense() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [splitType, setSplitType] = useState("EQUAL");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      splitType: "EQUAL",
      splits: {},
    },
  });

  // Watch for changes in form values
  const amount = watch("amount");
  const paidBy = watch("paidBy");
  const currentSplitType = watch("splitType");
  const equalShare = users.length > 0 ? (parseFloat(amount || 0) / users.length).toFixed(2) : 0;

  // Fetch household members
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/household/${id}`);
        if (!res.ok) throw new Error("Failed to fetch household data");
        const data = await res.json();
        
        const memberUsers = data.members?.map(member => ({
          id: member.user.id,
          name: member.user.name,
          email: member.user.email
        })) || [];
        
        setUsers(memberUsers);
        
        // Initialize default values
        if (memberUsers.length > 0) {
          setValue("paidBy", memberUsers[0].id);
          
          // Initialize splits with all users selected
          const initialSplits = {};
          memberUsers.forEach(user => {
            initialSplits[user.id] = true;
          });
          setValue("splits", initialSplits);
        }
      } catch (error) {
        console.error("Error fetching household data:", error);
        toast.error("Failed to load household members");
      }
    };
    
    fetchUsers();
  }, [id, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Convert amount to number and format data for the API
      const expenseData = {
        description: data.description,
        amount: parseFloat(data.amount),
        paidById: data.paidBy,  // Changed from paidBy to paidById
        householdId: id,        // Add householdId from URL params
        splitType: data.splitType,
        splits: data.splits
      };

      const res = await fetch("/api/expense/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      const responseData = await res.json();
      
      if (!res.ok) {
        throw new Error(responseData.error || "Failed to create expense");
      }

      // Show success message
      toast.success("Expense added successfully!");
      
      // Reset form
      reset({
        description: "",
        amount: "",
        paidBy: users[0]?.id || "",
        splitType: "EQUAL",
        splits: users.reduce((acc, user) => ({ ...acc, [user.id]: true }), {})
      });
      setSplitType("EQUAL");
      
      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error("Error creating expense:", error);
      toast.error(error.message || "An error occurred while creating the expense");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle split type change
  const handleSplitTypeChange = (value) => {
    setSplitType(value);
    setValue("splitType", value);
  };

  // Toggle user in split
  const toggleUserInSplit = (userId, checked) => {
    const currentSplits = watch("splits") || {};
    setValue("splits", {
      ...currentSplits,
      [userId]: checked
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Button
        variant="ghost"
        className="mb-6 px-0 hover:bg-transparent"
        onClick={() => router.back()}
        disabled={isLoading}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Household
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Expense</CardTitle>
          <CardDescription>
            Add a new expense to your household and split it with members
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Dinner, Rent, Groceries, etc."
                  {...register("description")}
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="pl-8"
                    placeholder="0.00"
                    {...register("amount")}
                    disabled={isLoading}
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>

              {/* Paid By */}
              <div className="space-y-2">
                <Label>Paid by</Label>
                <Select
                  onValueChange={(value) => setValue("paidBy", value)}
                  defaultValue={users[0]?.id}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select who paid" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Split Type */}
              <div className="space-y-2">
                <Label>Split Type</Label>
                <Select
                  onValueChange={handleSplitTypeChange}
                  value={splitType}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select split type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EQUAL">Equal Split</SelectItem>
                    <SelectItem value="CUSTOM">Custom Split</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Split Details */}
              <div className="space-y-3">
                <Label>Split Between</Label>
                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={watch(`splits.${user.id}`) ?? true}
                          onCheckedChange={(checked) => 
                            toggleUserInSplit(user.id, checked)
                          }
                          disabled={isLoading || splitType === 'EQUAL'}
                        />
                        <Label htmlFor={`user-${user.id}`} className="font-normal">
                          {user.name} {user.id === paidBy && "(You paid)"}
                        </Label>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ${splitType === 'EQUAL' ? equalShare : '0.00'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Expense"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
