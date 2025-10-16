import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Loader2, Send } from 'lucide-react';

interface TranscriptFormProps {
  onSubmit: (transcript: string) => Promise<void>;
  isLoading: boolean;
}

export const TranscriptForm: React.FC<TranscriptFormProps> = ({ onSubmit, isLoading }) => {
  const [transcript, setTranscript] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (transcript.trim().length < 10) {
      alert('Please enter a transcript with at least 10 characters');
      return;
    }
    await onSubmit(transcript.trim());
    setTranscript(''); // Clear form after successful submission
  };

  const handleClear = () => {
    setTranscript('');
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg py-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Send className="h-5 w-5 text-blue-600" />
          </div>
          Submit Meeting Transcript
        </CardTitle>
        <CardDescription className="text-base text-gray-600">
          Paste your meeting transcript below and AI will extract actionable tasks for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-3">
            <label htmlFor="transcript" className="text-sm font-medium">
              Meeting Transcript
            </label>
            <Textarea
              id="transcript"
              placeholder="Paste your meeting transcript here... 

Example:
Team meeting notes: John will prepare the Q4 report by Friday. Sarah needs to review the marketing strategy. Mike should schedule a follow-up meeting with the client next week."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
               className="min-h-[200px] resize-none border-2 border-gray-200 focus:border-blue-500 transition-colors text-base"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{transcript.length} characters</span>
              <span>Minimum 10 characters required</span>
            </div>
          </div>
          
          <div className="flex gap-4 pt-2">
            <Button 
              type="submit" 
              disabled={isLoading || transcript.trim().length < 10}
              className="flex-1 h-10 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Generate Action Items
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClear}
              disabled={isLoading || !transcript}
              className="h-10 px-4 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            >
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
