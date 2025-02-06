import React, {useState, useEffect} from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users } from 'lucide-react';
import {KudosHome} from "../components/KudosHome";
import {KudosCategories} from "../components/KudosCategories";
import {KudosReceived} from "../components/KudosReceived";
import {KudosGiven} from "../components/KudosGiven";
import { GiveKudosModal } from '@/components/GiveKudosModal';
import { AnimationWrapper } from '@/common/page-animation';


export const KudosPage = () => {

    const [pageState, setPageState] = useState<"home"|"kudos-given"|"kudos-received"|"kudos-categories">("home");
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const handleModalClose = () => {
        setModalIsOpen(false)
    }

    const GiveKudosCard = () => {

        return (
        <Card className="bg-gradient-to-br mt-12 from-blue-500 to-blue-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8" />
              <div>
                <h3 className="text-xl font-bold">Appreciate your teammates</h3>
                <p className="text-blue-100">Take a moment to recognize great work</p>
              </div>
            </div>
            <Button onClick={() => {setModalIsOpen(true)}} className="bg-white text-blue-600 hover:bg-blue-50">
              Give Kudos
            </Button>
          </div>
        </CardContent>
      </Card>
        )
    }


  return (
    <>
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Navigation */}
      <nav className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800">Kudos</h1>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => setPageState("home")} className={`text-slate-600 hover:underline ${pageState === "home"? "underline":""}`}>Home</Button>
          <Button variant="ghost" onClick={() => setPageState("kudos-received")} className={`text-slate-600 hover:underline ${pageState === "kudos-received"? "underline":""}`}>Received</Button>
          <Button variant="ghost" onClick={() => setPageState("kudos-given")} className={`text-slate-600 hover:underline ${pageState === "kudos-given"? "underline":""}`}>Given</Button>
          <Button variant="ghost" onClick={() => setPageState("kudos-categories")} className={`text-slate-600 hover:underline ${pageState === "kudos-categories"? "underline":""}`}>Team Categories</Button>
        </div>
      </nav>

      {pageState === "home" &&
      <AnimationWrapper key={"kudos-home"}>
        <KudosHome/>
        {/* Give Kudos Section */}
        <GiveKudosCard/>
      </AnimationWrapper> 
      }

      {pageState === "kudos-received" &&
      <AnimationWrapper key={"kudos-received"}>
        <KudosReceived/>
        {/* Give Kudos Section */}
        <GiveKudosCard/>
      </AnimationWrapper> 
      }

      {pageState === "kudos-given" &&
      <AnimationWrapper key={"kudos-given"}>
        <KudosGiven/>
        {/* Give Kudos Section */}
        <GiveKudosCard/>
      </AnimationWrapper> 
      }

      {pageState === "kudos-categories" &&
      <AnimationWrapper key={"kudos-categories"}>
        <KudosCategories/>
      </AnimationWrapper> 
      }


    </div>
    {modalIsOpen && <GiveKudosModal isOpen={modalIsOpen} onClose={handleModalClose} />}
    </>
  );
};

export default KudosPage;