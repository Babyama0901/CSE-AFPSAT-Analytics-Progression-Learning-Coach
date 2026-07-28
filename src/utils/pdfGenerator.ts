import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnalyticsData, ScoreLog, SubjectStats } from '../types';
import { generateCoachingPlan } from './analytics';

export function generateAnalyticsReport(
  cseAnalytics: AnalyticsData, 
  afpsatAnalytics: AnalyticsData, 
  logs: ScoreLog[]
) {
  // Initialize document
  const doc = new jsPDF();
  let yPos = 20;
  
  // Title
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("CSE & AFPSAT Comprehensive Analytics Report", 14, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, yPos);
  
  yPos += 20;

  // Overview Section
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("1. Overall Readiness Overview", 14, yPos);
  yPos += 10;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Exam Type', 'Readiness Score', 'Critical Deficit']],
    body: [
      [
        'CSE', 
        `${cseAnalytics.readinessScore.toFixed(1)}%`, 
        cseAnalytics.weakestSubject ? cseAnalytics.weakestSubject.subject : 'N/A'
      ],
      [
        'AFPSAT', 
        `${afpsatAnalytics.readinessScore.toFixed(1)}%`, 
        afpsatAnalytics.weakestSubject ? afpsatAnalytics.weakestSubject.subject : 'N/A'
      ]
    ],
    theme: 'grid',
    headStyles: { fillColor: [14, 165, 233] }, // cyan-500
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // CSE Mastery Table
  if (cseAnalytics.subjectStats.length > 0) {
    doc.setFontSize(14);
    doc.text("2. CSE Subject Mastery", 14, yPos);
    yPos += 10;

    const cseBody = cseAnalytics.subjectStats.map((stat: SubjectStats) => [
      stat.subject,
      `${stat.baselinePercentage.toFixed(1)}%`,
      `${stat.latestPercentage.toFixed(1)}%`,
      `${stat.averagePercentage.toFixed(1)}%`,
      stat.logsCount.toString()
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Subject Cluster', 'Baseline', 'Latest', 'Average', 'Logs Analyzed']],
      body: cseBody,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }, // blue-500
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 20;
  }

  // AFPSAT Mastery Table
  if (afpsatAnalytics.subjectStats.length > 0) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.text("3. AFPSAT Subject Mastery", 14, yPos);
    yPos += 10;

    const afpsatBody = afpsatAnalytics.subjectStats.map((stat: SubjectStats) => [
      stat.subject,
      `${stat.baselinePercentage.toFixed(1)}%`,
      `${stat.latestPercentage.toFixed(1)}%`,
      `${stat.averagePercentage.toFixed(1)}%`,
      stat.logsCount.toString()
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Subject Cluster', 'Baseline', 'Latest', 'Average', 'Logs Analyzed']],
      body: afpsatBody,
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] }, // violet-500
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 20;
  }

  // AI Coaching Directives
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("4. AI Coaching Directives", 14, yPos);
  yPos += 10;

  // Generate for both
  const printDirectives = (title: string, weakestSubject: SubjectStats | null, latestLog?: ScoreLog) => {
    if (!weakestSubject) return;
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`[${title} Directives]`, 14, yPos);
    yPos += 8;

    const plan = generateCoachingPlan(weakestSubject, latestLog);
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105); // slate-600
    
    plan.forEach(line => {
      // Split text to fit page width
      const lines = doc.splitTextToSize(`- ${line}`, 180);
      doc.text(lines, 14, yPos);
      yPos += (lines.length * 5) + 3;
      
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }
    });
    yPos += 5;
  };

  const latestCseLog = logs.filter(l => l.exam === 'CSE' || !l.exam).pop();
  const latestAfpsatLog = logs.filter(l => l.exam === 'AFPSAT').pop();

  printDirectives("CSE", cseAnalytics.weakestSubject, latestCseLog);
  printDirectives("AFPSAT", afpsatAnalytics.weakestSubject, latestAfpsatLog);

  yPos += 10;
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // Raw Diagnostics History
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text("5. Raw Diagnostics History", 14, yPos);
  yPos += 10;

  const rawLogsBody = logs.map(log => [
    new Date(log.timestamp).toLocaleDateString(),
    log.exam || 'CSE',
    log.subject,
    `${log.score} / ${log.total}`,
    `${((log.score / log.total) * 100).toFixed(1)}%`,
    log.subtopicsMissed || 'None'
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Exam', 'Subject', 'Raw Score', 'Percentage', 'Subtopics Missed']],
    body: rawLogsBody,
    theme: 'plain',
    headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42] }, // slate-100
    styles: { fontSize: 8 }
  });

  // Save the PDF
  doc.save('Analytics_Engine_Report.pdf');
}
