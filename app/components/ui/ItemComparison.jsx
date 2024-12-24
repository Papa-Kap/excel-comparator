'use client'

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export default function ItemComparison() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [columns1, setColumns1] = useState([]);
  const [columns2, setColumns2] = useState([]);
  const [selectedColumn1, setSelectedColumn1] = useState('');
  const [selectedColumn2, setSelectedColumn2] = useState('');
  const [similarityThreshold, setSimilarityThreshold] = useState(80);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (e, fileNumber) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { 
          type: 'array',
          cellDates: true,
          cellNF: true,
          cellText: true
        });
        
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        // Extract column headers (first row)
        const headers = data[0];
        
        if (fileNumber === 1) {
          setFile1(data);
          setColumns1(headers);
        } else {
          setFile2(data);
          setColumns2(headers);
        }
      } catch (error) {
        console.error('Error processing Excel file:', error);
        alert('Error processing Excel file. Please make sure it\'s a valid Excel file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const compareItems = async () => {
    if (!file1 || !file2 || !selectedColumn1 || !selectedColumn2) {
      alert('Please select both files and columns to compare');
      return;
    }

    setIsLoading(true);

    try {
      const column1Index = columns1.indexOf(selectedColumn1);
      const column2Index = columns2.indexOf(selectedColumn2);

      // Extract values from selected columns (skip header row)
      const values1 = file1.slice(1).map(row => row[column1Index]?.toString() || '');
      const values2 = file2.slice(1).map(row => row[column2Index]?.toString() || '');

      const response = await fetch('/api/compare-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items1: values1,
          items2: values2,
          similarityThreshold: similarityThreshold / 100, // Convert to decimal
        }),
      });

      if (!response.ok) {
        throw new Error('Comparison request failed');
      }

      const results = await response.json();
      setComparisonResults(results);
    } catch (error) {
      console.error('Error comparing items:', error);
      alert('Error comparing items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Excel File Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File 1 Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">File 1</h3>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload(e, 1)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {columns1.length > 0 && (
                <Select onValueChange={setSelectedColumn1} value={selectedColumn1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select column to compare" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns1.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* File 2 Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">File 2</h3>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload(e, 2)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {columns2.length > 0 && (
                <Select onValueChange={setSelectedColumn2} value={selectedColumn2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select column to compare" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns2.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Similarity Threshold Slider */}
          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium">
              Similarity Threshold: {similarityThreshold}%
            </label>
            <Slider
              value={[similarityThreshold]}
              onValueChange={(value) => setSimilarityThreshold(value[0])}
              min={0}
              max={100}
              step={1}
            />
          </div>

          {/* Compare Button */}
          <Button
            onClick={compareItems}
            disabled={isLoading || !file1 || !file2 || !selectedColumn1 || !selectedColumn2}
            className="mt-6 w-full"
          >
            {isLoading ? 'Comparing...' : 'Compare Files'}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {comparisonResults && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comparisonResults.matches.map((match, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium">Match {index + 1}</p>
                    <p>File 1: {match.item1}</p>
                    <p>File 2: {match.item2}</p>
                    <p className="text-sm text-gray-500">
                      Similarity: {(match.similarity * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
              {comparisonResults.matches.length === 0 && (
                <p className="text-gray-500">No matches found above the similarity threshold.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}