import { showAnalyticsDashboard, showATSScore, analyzeKeywords, analyzeLengthMetrics, showPerformanceMetrics } from './dist/modules/interactive-statistics.js';
import { loadResumeData } from './dist/modules/data.js';

async function testAnalytics() {
  console.log('🧪 Testing Analytics Features\n');
  
  try {
    // Load resume data
    const resumeData = await loadResumeData();
    console.log('✅ Resume data loaded successfully\n');
    
    // Test Analytics Dashboard
    console.log('📊 Testing Analytics Dashboard:');
    console.log('=' .repeat(50));
    await showAnalyticsDashboard(resumeData);
    
    // Test ATS Score
    console.log('\n🎯 Testing ATS Score Analysis:');
    console.log('=' .repeat(50));
    await showATSScore(resumeData);
    
    // Test Keyword Analysis
    console.log('\n🔍 Testing Keyword Analysis:');
    console.log('=' .repeat(50));
    await analyzeKeywords(resumeData);
    
    // Test Length Analysis
    console.log('\n📏 Testing Length Analysis:');
    console.log('=' .repeat(50));
    await analyzeLengthMetrics(resumeData);
    
    // Test Performance Metrics
    console.log('\n📈 Testing Performance Metrics:');
    console.log('=' .repeat(50));
    await showPerformanceMetrics(resumeData);
    
    console.log('\n🎉 All analytics features tested successfully!');
    
  } catch (error) {
    console.error('❌ Error testing analytics:', error.message);
    process.exit(1);
  }
}

testAnalytics();