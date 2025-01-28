"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

const FormKebutuhanKhusus = ({ pertanyaan }) => {
  const { register, formState: { errors } } = useFormContext(); // Mengakses context dari form induk
  const [activeTab, setActiveTab] = useState("penglihatan");

  return (
    <div className="py-4">
      <Tabs 
        defaultValue="penglihatan" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full max-w-lg"
      >
        {/* Daftar Tab */}
        <TabsList>
          {Object.keys(pertanyaan).map((key) => (
            <TabsTrigger key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Konten Tab */}
        <div className="py-4">
          <TabsContent value={activeTab}>
            {pertanyaan[activeTab] && pertanyaan[activeTab].length > 0 ? (
              pertanyaan[activeTab].map((item) => (
                <FormField
                  key={item.id}
                  name={`question-${item.id}`}
                  render={() => (
                    <FormItem>
                      <FormLabel className="font-semibold text-sm text-gray-600">
                        {item.question}
                      </FormLabel>
                      <FormControl>
                        <RadioGroup className="flex space-x-4 mt-2">
                          {item.options.map((option) => (
                            <div key={`${item.id}-${option}`} className="flex items-center">
                              <RadioGroupItem
                                {...register(`question-${item.id}`, { required: true })}
                                value={option}
                                id={`option-${item.id}-${option}`}
                              />
                              <FormLabel
                                htmlFor={`option-${item.id}-${option}`}
                                className="text-gray-600"
                              >
                                {option}
                              </FormLabel>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      {errors[`question-${item.id}`] && (
                        <FormMessage className="text-red-500">
                          {errors[`question-${item.id}`]?.message || "This question is required"}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              ))
            ) : (
              <p className="text-gray-600">Data tidak tersedia untuk tab ini.</p>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default FormKebutuhanKhusus;