import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { IrisHeader } from '@/components/IrisHeader';
import { CameraViewfinder } from '@/components/CameraViewfinder';
import { AnalysisResult } from '@/components/AnalysisResult';
import { HistoryPanel } from '@/components/HistoryPanel';
import { CreatorButton } from '@/components/CreatorButton';
import { useVisionAnalysis } from '@/hooks/useVisionAnalysis';

const Index = () => {
  const [started, setStarted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { analyze, askQuestion, tellMeMore, reset, clearHistory, isAnalyzing, isLoadingMore, result, capturedImage, history } = useVisionAnalysis();

  const handleBack = () => {
    reset();
    setStarted(false);
  };

  const handleCapture = (imageData: string) => {
    analyze(imageData);
  };

  const handleRetake = () => {
    reset();
  };

  const handleQuestion = (question: string) => {
    askQuestion(question);
  };

  const handleSelectHistoryItem = (item: { thumbnail: string }) => {
    analyze(item.thumbnail);
    setShowHistory(false);
  };

  if (!started) {
    return <WelcomeScreen onStart={() => setStarted(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <IrisHeader 
        memoryCount={history.length} 
        onShowHistory={() => setShowHistory(true)} 
      />

      {/* Main Content */}
      <main className="flex-1 px-4 pb-4 flex flex-col">
        <AnimatePresence mode="wait">
          {result && capturedImage && !isAnalyzing ? (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <AnalysisResult
                result={result}
                capturedImage={capturedImage}
                onReset={reset}
                onTellMeMore={tellMeMore}
                isLoadingMore={isLoadingMore}
              />
            </motion.div>
          ) : (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <CameraViewfinder
                onCapture={handleCapture}
                onQuestion={handleQuestion}
                isAnalyzing={isAnalyzing}
                analysisResult={result}
                onBack={handleBack}
                onRetake={handleRetake}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* History Panel */}
      <HistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onSelectItem={handleSelectHistoryItem}
        onClearHistory={clearHistory}
      />

      {/* Creator Button */}
      <CreatorButton />
    </div>
  );
};

export default Index;
