import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  UserCircle,
  Briefcase,
  Check,
  X
} from "lucide-react";
import { useUser, UserRole } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const mockTeamMembers = [
  {
    id: "TM001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin" as UserRole,
    businesses: ["NYC001", "LA002", "CHI003"],
    status: "active"
  },
  {
    id: "TM002",
    name: "Alice Smith",
    email: "alice.smith@example.com",
    role: "partner" as UserRole,
    businesses: ["NYC001", "LA002"],
    status: "active"
  },
  {
    id: "TM003",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "data-entry" as UserRole,
    businesses: ["NYC001"],
    status: "active"
  },
  {
    id: "TM004",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    role: "partner" as UserRole,
    businesses: ["CHI003"],
    status: "active"
  },
  {
    id: "TM005",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "data-entry" as UserRole,
    businesses: ["LA002"],
    status: "active"
  }
];

const mockBusinesses = [
  { id: "NYC001", name: "New York Office" },
  { id: "LA002", name: "Los Angeles Branch" },
  { id: "CHI003", name: "Chicago Headquarters" }
];

const Teams = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useUser();
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<typeof mockTeamMembers[0] | null>(null);
  
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "" as UserRole | "",
    businesses: [] as string[]
  });
  
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.role || newMember.businesses.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingMember) {
      setTeamMembers(
        teamMembers.map(member => 
          member.id === editingMember.id 
            ? {
                ...member,
                name: newMember.name,
                email: newMember.email,
                role: newMember.role as UserRole,
                businesses: newMember.businesses
              } 
            : member
        )
      );
      
      toast({
        title: "Team Member Updated",
        description: `${newMember.name} has been updated.`
      });
    } else {
      const newTeamMember = {
        id: `TM${String(teamMembers.length + 1).padStart(3, '0')}`,
        name: newMember.name,
        email: newMember.email,
        role: newMember.role as UserRole,
        businesses: newMember.businesses,
        status: "active"
      };
      
      setTeamMembers([...teamMembers, newTeamMember]);
      
      toast({
        title: "Team Member Added",
        description: `${newMember.name} has been added to the team.`
      });
    }
    
    setIsAddMemberOpen(false);
    setEditingMember(null);
    
    setNewMember({
      name: "",
      email: "",
      role: "",
      businesses: []
    });
  };
  
  const handleEditMember = (member: typeof mockTeamMembers[0]) => {
    setEditingMember(member);
    setNewMember({
      name: member.name,
      email: member.email,
      role: member.role,
      businesses: member.businesses
    });
    setIsAddMemberOpen(true);
  };
  
  const handleStatusChange = (id: string, newStatus: string) => {
    setTeamMembers(
      teamMembers.map(member => 
        member.id === id 
          ? { ...member, status: newStatus } 
          : member
      )
    );
    
    const member = teamMembers.find(m => m.id === id);
    
    toast({
      title: newStatus === "active" ? "Member Activated" : "Member Deactivated",
      description: `${member?.name} has been ${newStatus === "active" ? "activated" : "deactivated"}.`
    });
  };
  
  const toggleBusiness = (businessId: string) => {
    if (newMember.businesses.includes(businessId)) {
      setNewMember({
        ...newMember,
        businesses: newMember.businesses.filter(id => id !== businessId)
      });
    } else {
      setNewMember({
        ...newMember,
        businesses: [...newMember.businesses, businessId]
      });
    }
  };
  
  const handleDialogClose = () => {
    setNewMember({
      name: "",
      email: "",
      role: "",
      businesses: []
    });
    setEditingMember(null);
  };
  
  if (!hasPermission("view", "user")) {
    navigate("/dashboard");
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Team Management
          </h1>
          <p className="text-muted-foreground">
            Manage team members and their access to businesses
          </p>
        </div>
        
        {hasPermission("create", "user") && (
          <Dialog 
            open={isAddMemberOpen} 
            onOpenChange={(open) => {
              setIsAddMemberOpen(open);
              if (!open) handleDialogClose();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? "Edit Team Member" : "Add New Team Member"}
                </DialogTitle>
                <DialogDescription>
                  {editingMember 
                    ? "Update team member details and access permissions." 
                    : "Add a new member to your team and assign their role and business access."}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name"
                      placeholder="Enter full name" 
                      className="pl-10"
                      value={newMember.name}
                      onChange={e => setNewMember({...newMember, name: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="Enter email address" 
                      className="pl-10"
                      value={newMember.email}
                      onChange={e => setNewMember({...newMember, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="role" className="text-sm font-medium">Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Select 
                      onValueChange={(value) => setNewMember({...newMember, role: value as UserRole})}
                      value={newMember.role}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="partner">Partner</SelectItem>
                        <SelectItem value="data-entry">Data Entry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Business Access</label>
                  <div className="border rounded-md p-3 space-y-2">
                    {mockBusinesses.map(business => (
                      <div key={business.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`business-${business.id}`}
                          checked={newMember.businesses.includes(business.id)}
                          onChange={() => toggleBusiness(business.id)}
                          className="rounded"
                        />
                        <label htmlFor={`business-${business.id}`} className="text-sm">
                          {business.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember}>
                  {editingMember ? "Update Member" : "Add Team Member"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search team members..." 
          className="pl-10" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Business Access</TableHead>
              <TableHead>Status</TableHead>
              {hasPermission("edit", "user") && (
                <TableHead className="text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={hasPermission("edit", "user") ? 6 : 5} className="text-center text-muted-foreground py-8">
                  No team members found
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map(member => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        member.role === "admin" 
                          ? "default" 
                          : member.role === "partner" 
                            ? "secondary" 
                            : "outline"
                      }
                    >
                      {member.role === "admin" 
                        ? "Administrator" 
                        : member.role === "partner" 
                          ? "Partner" 
                          : "Data Entry"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {member.businesses.map(businessId => {
                        const business = mockBusinesses.find(b => b.id === businessId);
                        return (
                          <Badge key={businessId} variant="outline" className="text-xs">
                            {business?.name || businessId}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={member.status === "active" ? "default" : "destructive"}
                      className={member.status === "active" ? "bg-green-100 text-green-800" : ""}
                    >
                      {member.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  {hasPermission("edit", "user") && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {user?.id !== member.id && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(
                              member.id, 
                              member.status === "active" ? "inactive" : "active"
                            )}
                            className={
                              member.status === "active" 
                                ? "text-destructive hover:text-destructive/90" 
                                : "text-green-600 hover:text-green-700"
                            }
                          >
                            {member.status === "active" ? (
                              <>
                                <X className="h-4 w-4 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        )}
                        {member.id !== user?.id && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditMember(member)}
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Teams;
