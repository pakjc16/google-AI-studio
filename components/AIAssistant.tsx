import React, { useState } from 'react';
import { generateLeaseAdvice, draftNoticeMessage } from '../services/geminiService';
import { Tenant, PaymentRecord, PaymentStatus, Unit, Property } from '../types';
import { Send, Bot, Loader2, Sparkles, MessageSquare } from 'lucide-react';

interface AIAssistantProps {
  tenants: Tenant[];
  payments: PaymentRecord[];
  units: Unit[];
  properties: Property[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ tenants, payments, units, properties }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', text: string}[]>([
    { role: 'assistant', text: '안녕하세요! 임대 관리 AI 비서입니다. 무엇을 도와드릴까요? 미납 문자 작성이나 계약 관련 질문을 해주세요.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const overduePayments = payments.filter(p => p.status === PaymentStatus.OVERDUE);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const context = `
      [기본 정보]
      현재 관리 건물 수: ${properties.length}개
      현재 관리 호실 수: ${units.length}개
      현재 입주 임차인 수: ${tenants.length}명
      현재 미납 건수: ${overduePayments.length}건

      [건물 목록]
      ${properties.map(p => `- ${p.name} (${p.type}, ${p.address})`).join('\n')}

      [임차인 목록 예시]
      ${tenants.map(t => {
          const u = units.find(unit => unit.id === t.unitId);
          const p = properties.find(prop => prop.id === u?.propertyId);
          return `- ${p?.name} ${u?.name}: ${t.name}`;
      }).join('\n')}
    `;

    const response = await generateLeaseAdvice(userMsg, context);
    
    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setIsLoading(false);
  };

  const handleDraftNotice = async (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;
    const tenant = tenants.find(t => t.id === payment.tenantId);
    if (!tenant) return;
    const unit = units.find(u => u.id === tenant.unitId);

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', text: `${tenant.name} (${unit?.name})님 미납 안내 문자 작성해줘` }]);

    const response = await draftNoticeMessage(
        tenant.name, 
        payment.amount, 
        payment.type, 
        Math.floor((new Date().getTime() - new Date(payment.date).getTime()) / (1000 * 3600 * 24))
    );

    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Sparkles className="text-purple-500" size={20} />
            AI 스마트 비서
        </div>
        {overduePayments.length > 0 && (
             <div className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-lg">
                미납 {overduePayments.length}건 감지됨
             </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-bl-none'
            }`}>
              {msg.role === 'assistant' && <Bot size={16} className="mb-2 text-purple-500" />}
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="animate-spin text-blue-500" size={18} />
                    <span className="text-sm text-slate-500">생성 중입니다...</span>
                </div>
            </div>
        )}
      </div>

      {/* Suggested Actions for Overdue items */}
      {overduePayments.length > 0 && !isLoading && (
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex gap-2 overflow-x-auto">
              {overduePayments.map(p => {
                  const t = tenants.find(tenant => tenant.id === p.tenantId);
                  const u = units.find(unit => unit.id === t?.unitId);
                  return (
                      <button 
                        key={p.id}
                        onClick={() => handleDraftNotice(p.id)}
                        className="flex-shrink-0 text-xs bg-white border border-rose-200 text-rose-700 px-3 py-1.5 rounded-full hover:bg-rose-50 flex items-center gap-1 transition-colors"
                      >
                          <MessageSquare size={12} />
                          {u?.name} {t?.name} 독촉 문자
                      </button>
                  )
              })}
          </div>
      )}

      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="AI에게 무엇이든 물어보세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-2 rounded-lg transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;