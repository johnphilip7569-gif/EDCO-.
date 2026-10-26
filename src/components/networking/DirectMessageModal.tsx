"use client";

import React, { useState, useEffect, useRef } from "react";
import { PublicUserProfile, DirectMessage } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import {
  X,
  Send,
  Lock,
  Loader2,
  CheckCheck,
  MessageSquare
} from "lucide-react";

interface DirectMessageModalProps {
  peer: PublicUserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onMessageSent?: (msg: string) => void;
}

export default function DirectMessageModal({
  peer,
  isOpen,
  onClose,
  onMessageSent,
}: DirectMessageModalProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversation messages
  const fetchMessages = async () => {
    if (!user || !peer) return;
    try {
      const res = await fetch(`/api/network/messages?userId=${user.uid}&peerId=${peer.userId}`, {
        headers: { "x-user-id": user.uid },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.warn("Fetch direct messages error:", err);
    }
  };

  useEffect(() => {
    if (isOpen && peer && user) {
      setIsLoading(true);
      fetchMessages().finally(() => setIsLoading(false));
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 200);
    }
  }, [isOpen, peer?.userId, user?.uid]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !peer || isSending) return;

    const messageText = input.trim();
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: DirectMessage = {
      id: tempId,
      senderId: user.uid,
      receiverId: peer.userId,
      message: messageText,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/network/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.uid,
        },
        body: JSON.stringify({
          receiverId: peer.userId,
          message: messageText,
          senderName: user.name || "A peer",
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data.message : m))
        );
        onMessageSent?.(messageText);
      }
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen || !peer) return null;

  const peerInitials = (peer.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#E5E5E5] flex flex-col">
          {/* Header */}
          <div className="bg-black text-white p-4 sm:p-5 flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                {peer.avatarUrl ? (
                  <img
                    src={peer.avatarUrl}
                    alt={peer.name}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-neutral-900 text-white border border-neutral-700 flex items-center justify-center font-bold text-xs">
                    {peerInitials}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white truncate leading-none">
                    {peer.name}
                  </h3>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                    Member
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 truncate mt-1 leading-none">
                  {peer.headline || (peer.userType === "STUDENT" ? "Student" : "Professional")}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
              aria-label="Close direct message"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Private Channel Banner */}
          <div className="bg-neutral-100 border-b border-[#E5E5E5] px-4 py-2 flex items-center justify-between text-[11px] text-neutral-700">
            <div className="flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-black shrink-0" />
              <span>Direct Messaging</span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono">Private</span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-black" />
                <p className="text-xs">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                <div className="w-12 h-12 rounded-lg bg-white border border-[#E5E5E5] text-neutral-400 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black">Direct Message with {peer.name}</h4>
                  <p className="text-[11px] text-neutral-500 mt-1 max-w-[240px]">
                    Send a message to start a conversation.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.uid;
                const timeStr = new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <div className="w-7 h-7 rounded-full bg-neutral-200 border border-neutral-300 text-black flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {peerInitials}
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-xs leading-relaxed ${
                        isMe
                          ? "bg-black text-white"
                          : "bg-white border border-[#E5E5E5] text-black"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                      <div
                        className={`text-[9px] mt-1 flex items-center justify-end gap-1 ${
                          isMe ? "text-neutral-400" : "text-neutral-400"
                        }`}
                      >
                        <span>{timeStr}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-neutral-400" />}
                      </div>
                    </div>

                    {isMe && (
                      <div className="w-7 h-7 rounded-full bg-neutral-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        Me
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Dispatch Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-[#E5E5E5] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${peer.name.split(" ")[0]}...`}
              disabled={isSending}
              className="flex-1 bg-white border border-[#E5E5E5] rounded-lg px-3.5 py-2 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="p-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg disabled:opacity-40 transition-all shrink-0 flex items-center justify-center"
              aria-label="Send direct message"
            >
              {isSending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              ) : (
                <Send className="w-3.5 h-3.5 text-white" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
