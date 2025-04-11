
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { Briefcase, Calendar, Clock, MapPin, Send, User } from "lucide-react";
import { toast } from "sonner";
import { dummyWorkers, dummyJobs } from "@/utils/dummyData";

type MessageType = {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isMine: boolean;
};

type ConversationType = {
  id: string;
  name: string;
  role: 'worker' | 'employer';
  avatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
  jobId?: string;
  jobTitle?: string;
};

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [relatedJob, setRelatedJob] = useState<typeof dummyJobs[0] | null>(null);

  // Generate mock conversations on component mount
  useEffect(() => {
    // In a real app, these would come from a database
    const mockConversations = generateMockConversations();
    setConversations(mockConversations);
    
    if (mockConversations.length > 0) {
      handleSelectConversation(mockConversations[0]);
    }
  }, []);

  const generateMockConversations = (): ConversationType[] => {
    // Generate 5 random conversations with employers/workers
    return Array.from({ length: 5 }, (_, i) => {
      const isEmployer = Math.random() > 0.5;
      const randomPerson = isEmployer 
        ? { name: getRandomCompanyName(), role: 'employer' as const } 
        : { name: dummyWorkers[Math.floor(Math.random() * dummyWorkers.length)].name, role: 'worker' as const };
        
      const randomJob = dummyJobs[Math.floor(Math.random() * dummyJobs.length)];
      
      return {
        id: `conv-${i + 1}`,
        name: randomPerson.name,
        role: randomPerson.role,
        avatar: undefined,
        lastMessage: getRandomMessage(isEmployer),
        lastMessageTime: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)),
        unread: Math.floor(Math.random() * 3),
        jobId: randomJob.id,
        jobTitle: randomJob.title
      };
    });
  };

  const getRandomCompanyName = () => {
    const companies = [
      "TechSolutions Inc.", 
      "Global Enterprises", 
      "CleanMax Services", 
      "QuickMeals Delivery", 
      "EventPro Caterers",
      "WorkSpace Interiors", 
      "ABC Corp"
    ];
    return companies[Math.floor(Math.random() * companies.length)];
  };

  const getRandomMessage = (isEmployer: boolean) => {
    const employerMessages = [
      "When can you start the job?",
      "Are you available this weekend?",
      "Thank you for your great work yesterday!",
      "Could you provide an update on the progress?",
      "I'd like to discuss an upcoming project"
    ];
    
    const workerMessages = [
      "I'm available to start on Monday",
      "Do you need any specific equipment for this job?",
      "Thank you for the opportunity",
      "I've completed the task as requested",
      "Could we discuss the payment details?"
    ];
    
    return isEmployer 
      ? employerMessages[Math.floor(Math.random() * employerMessages.length)]
      : workerMessages[Math.floor(Math.random() * workerMessages.length)];
  };

  // Generate mock messages for the selected conversation
  const handleSelectConversation = (conversation: ConversationType) => {
    setSelectedConversation(conversation);
    
    // Find the related job
    if (conversation.jobId) {
      const job = dummyJobs.find(j => j.id === conversation.jobId) || null;
      setRelatedJob(job);
    } else {
      setRelatedJob(null);
    }
    
    // Generate mock messages
    const mockMessages: MessageType[] = [];
    // Generate between 5-15 messages for the conversation
    const messageCount = 5 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < messageCount; i++) {
      const isMine = Math.random() > 0.4; // 60% chance the message is from the current user
      mockMessages.push({
        id: `msg-${conversation.id}-${i}`,
        content: isMine ? getRandomMessage(!conversation.role.includes('employer')) : getRandomMessage(conversation.role.includes('employer')),
        senderId: isMine ? 'current-user' : conversation.id,
        senderName: isMine ? 'You' : conversation.name,
        timestamp: new Date(Date.now() - (messageCount - i) * 1000 * 60 * 10), // 10 minutes between messages
        isMine
      });
    }
    
    setMessages(mockMessages);
    
    // Mark conversation as read
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversation.id ? { ...conv, unread: 0 } : conv
      )
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const newMsg: MessageType = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      senderId: 'current-user',
      senderName: 'You',
      timestamp: new Date(),
      isMine: true
    };
    
    setMessages(prev => [...prev, newMsg]);
    
    // Update last message in conversation list
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date() } 
          : conv
      )
    );
    
    setNewMessage("");
    toast.success("Message sent");
    
    // Simulate reply after a delay (for demo purposes)
    setTimeout(() => {
      const replyMsg: MessageType = {
        id: `msg-${Date.now() + 1}`,
        content: getRandomMessage(selectedConversation.role.includes('employer')),
        senderId: selectedConversation.id,
        senderName: selectedConversation.name,
        timestamp: new Date(),
        isMine: false
      };
      
      setMessages(prev => [...prev, replyMsg]);
      
      // Update last message in conversation list
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, lastMessage: replyMsg.content, lastMessageTime: new Date() } 
            : conv
        )
      );
    }, 1500 + Math.random() * 3000);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Messages</h1>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(85vh-100px)]">
              {/* Conversations List */}
              <div className="border-r border-gray-200">
                <div className="p-4 border-b">
                  <h2 className="font-semibold">Conversations</h2>
                </div>
                <ScrollArea className="h-[calc(85vh-148px)]">
                  {conversations.map(conversation => (
                    <div
                      key={conversation.id}
                      className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-gray-50' : ''
                      }`}
                      onClick={() => handleSelectConversation(conversation)}
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">{conversation.name}</div>
                        <div className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageTime)}
                        </div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <div className="text-sm text-gray-600 truncate max-w-[180px]">
                          {conversation.lastMessage}
                        </div>
                        {conversation.unread > 0 && (
                          <div className="bg-smartflex-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {conversation.unread}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        {conversation.role === 'employer' ? (
                          <Briefcase className="w-3 h-3 mr-1" />
                        ) : (
                          <User className="w-3 h-3 mr-1" />
                        )}
                        {conversation.role === 'employer' ? 'Employer' : 'Worker'}
                        {conversation.jobTitle && (
                          <span className="ml-2">· {conversation.jobTitle}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
              
              {/* Message Area */}
              <div className="col-span-2 flex flex-col">
                {selectedConversation ? (
                  <>
                    <div className="p-4 border-b flex justify-between items-center">
                      <div>
                        <h2 className="font-semibold">{selectedConversation.name}</h2>
                        <div className="text-xs text-gray-500 flex items-center">
                          {selectedConversation.role === 'employer' ? (
                            <Briefcase className="w-3 h-3 mr-1" />
                          ) : (
                            <User className="w-3 h-3 mr-1" />
                          )}
                          {selectedConversation.role === 'employer' ? 'Employer' : 'Worker'}
                        </div>
                      </div>
                      
                      <div>
                        <Button variant="outline" size="sm">View Profile</Button>
                      </div>
                    </div>
                    
                    <ScrollArea className="flex-grow p-4 h-[calc(85vh-248px)]">
                      <div className="space-y-4">
                        {messages.map(message => (
                          <div 
                            key={message.id}
                            className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.isMine 
                                  ? 'bg-smartflex-blue text-white rounded-br-none'
                                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
                              }`}
                            >
                              <div className="text-sm">{message.content}</div>
                              <div className={`text-xs mt-1 ${message.isMine ? 'text-blue-100' : 'text-gray-500'}`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="min-h-[80px] resize-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button 
                          className="self-end" 
                          size="icon"
                          onClick={handleSendMessage}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select a conversation to start messaging
                  </div>
                )}
              </div>
              
              {/* Job Details (if applicable) */}
              <div className="hidden lg:block border-l border-gray-200">
                {selectedConversation && relatedJob ? (
                  <div className="p-4">
                    <h3 className="font-semibold mb-3">Related Job</h3>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{relatedJob.title}</CardTitle>
                        <CardDescription>{relatedJob.company}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 space-y-2">
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{relatedJob.location}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{relatedJob.date}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{relatedJob.time}</span>
                        </div>
                        <p className="text-sm mt-2">{relatedJob.description}</p>
                      </CardContent>
                    </Card>
                    
                    <div className="mt-4">
                      <Button variant="outline" className="w-full" size="sm">
                        View Full Job Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
                    {selectedConversation 
                      ? "No job associated with this conversation"
                      : "Select a conversation to view details"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
