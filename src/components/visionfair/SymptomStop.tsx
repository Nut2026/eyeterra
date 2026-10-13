import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SymptomProps {
  onResult: (label: string, value: string, concern: boolean, rawKey?: string) => void;
  initialValue?: string; // JSON stringified Record<string, 'yes'|'no'>
}

interface Question {
  id: string;
  text: string;
  weight: number;
  urgent: boolean;
}

const questions: Question[] = [
  { id: 'q1', text: 'Do you experience blurred vision, even with glasses/contacts?', weight: 3, urgent: false },
  { id: 'q2', text: 'Have you noticed sudden flashes of light or new floaters?', weight: 5, urgent: true },
  { id: 'q3', text: 'Do you have eye pain or significant discomfort?', weight: 4, urgent: true },
  { id: 'q4', text: 'Have you lost vision or noticed a "curtain" effect in your visual field?', weight: 5, urgent: true },
  { id: 'q5', text: 'Do you experience double vision?', weight: 4, urgent: true },
  { id: 'q6', text: 'Are your eyes frequently red, itchy, or producing discharge?', weight: 2, urgent: false },
  { id: 'q7', text: 'Do you have dry eyes that feel gritty or burn?', weight: 2, urgent: false },
  { id: 'q8', text: 'Do you experience headaches associated with eye use?', weight: 2, urgent: false },
  { id: 'q9', text: 'Do you have difficulty seeing in low light or at night?', weight: 3, urgent: false },
  { id: 'q10', text: 'Do bright lights cause excessive glare or halos?', weight: 3, urgent: false },
  { id: 'q11', text: 'Have a close relative been diagnosed with glaucoma or macular degeneration?', weight: 2, urgent: false },
  { id: 'q12', text: 'Has it been more than 2 years since your last eye exam?', weight: 2, urgent: false },
];

type Answer = 'yes' | 'no' | null;

const SymptomStop: React.FC<SymptomProps> = ({ onResult, initialValue }) => {
  const [answers, setAnswers] = useState<Record<string, Answer>>(() => {
    try { return initialValue ? JSON.parse(initialValue) : {}; } catch { return {}; }
  });

  const answered = Object.keys(answers).length;
  const allAnswered = answered === questions.length;
  const urgentYes = questions.filter(q => q.urgent && answers[q.id] === 'yes');
  const totalScore = questions.reduce((s, q) => s + (answers[q.id] === 'yes' ? q.weight : 0), 0);

  const handleSubmit = async () => {
    const yesAnswers = questions.filter(q => answers[q.id] === 'yes').map(q => q.text);
    const concern = urgentYes.length > 0 || totalScore >= 8;
    const value = yesAnswers.length === 0
      ? 'No significant symptoms'
      : `${yesAnswers.length} symptom(s): ${yesAnswers.slice(0, 3).join('; ')}${yesAnswers.length > 3 ? '…' : ''}`;
    onResult('Symptom Assessment', value, concern, JSON.stringify(answers));
  };

  return (
    <div className="space-y-5">
      <div className="border-2 border-primary bg-primary/5 px-4 py-3">
        <p className="text-sm font-semibold text-foreground mb-1">Instructions</p>
        <p className="text-sm text-muted-foreground text-pretty">
          Answer all 12 questions honestly. Symptoms are not stored or shared.
        </p>
      </div>

      <div className="space-y-2">
        {questions.map((q, i) => (
          <div key={q.id} className={`border-2 p-3 transition-colors ${
            answers[q.id] === 'yes' ? q.urgent ? 'border-destructive bg-destructive/5' : 'border-primary bg-primary/5'
            : answers[q.id] === 'no' ? 'border-border bg-muted/20' : 'border-border'
          }`}>
            <p className="text-sm text-foreground mb-2">
              <span className="font-semibold text-muted-foreground mr-2">{i + 1}.</span>
              {q.urgent && <span className="text-destructive font-bold mr-1">⚠</span>}
              {q.text}
            </p>
            <div className="flex gap-2">
              {(['yes', 'no'] as const).map(val => (
                <button key={val} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                  className={`px-4 py-1 border-2 text-sm font-medium transition-colors capitalize ${
                    answers[q.id] === val
                      ? val === 'yes' ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-border text-foreground'
                      : 'border-border text-muted-foreground hover:border-primary'
                  }`}
                  aria-pressed={answers[q.id] === val}
                >{val}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Button onClick={handleSubmit} disabled={!allAnswered} className="border-2 border-primary">
          Submit Assessment
        </Button>
        <span className="text-sm text-muted-foreground">{answered}/{questions.length} answered</span>
      </div>

      {urgentYes.length > 0 && (
        <div className="border-2 border-destructive bg-destructive/5 px-4 py-3">
          <p className="font-semibold text-sm text-foreground mb-1">Urgent symptoms noted:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {urgentYes.map(q => <li key={q.id} className="text-sm text-destructive">{q.text}</li>)}
          </ul>
          <p className="text-sm text-destructive mt-1 font-semibold">Please seek professional eye care promptly.</p>
        </div>
      )}    </div>
  );
};

export default SymptomStop;
