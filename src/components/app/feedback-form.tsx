import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

export function FeedbackForm() {
  return (
    <Card className="w-full max-w-screen-lg mx-auto">
      <CardHeader>
        <CardTitle>Was this analysis helpful?</CardTitle>
        <CardDescription>
          Your feedback helps us improve our AI. Let us know what you think.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
            <Button variant="outline"><ThumbsUp className="mr-2 h-4 w-4"/>Helpful</Button>
            <Button variant="outline"><ThumbsDown className="mr-2 h-4 w-4"/>Not Helpful</Button>
        </div>
        <Textarea placeholder="Share more details..." className="mb-4" />
        <Button>Submit Feedback</Button>
      </CardContent>
    </Card>
  );
}
