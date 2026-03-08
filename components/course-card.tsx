"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Clock, Users, Star, PlayCircle } from "lucide-react"
import { useState } from "react"

interface CourseCardProps {
  course: {
    id: string
    title: string
    instructor: string
    description: string
    price: number
    originalPrice?: number
    image: string
    duration: string
    students: number
    rating: number
    level: string
    category: string
    lessons: number
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="relative">
          <motion.img
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute bottom-4 left-4 right-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Button size="sm" className="w-full bg-white text-black hover:bg-gray-100">
                <PlayCircle className="w-4 h-4 mr-2" />
                Aperçu gratuit
              </Button>
            </motion.div>
          </motion.div>
          <Badge className="absolute top-2 right-2 bg-red-500 text-white">
            {course.level}
          </Badge>
        </div>

        <CardContent className="p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Badge variant="outline" className="mb-2 text-xs">
              {course.category}
            </Badge>
            <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Par {course.instructor}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
              {course.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {course.duration}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {course.students.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {course.rating}
              </div>
            </div>

            <div className="text-xs text-gray-500">
              {course.lessons} leçons
            </div>
          </motion.div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                {course.originalPrice && (
                  <span className="text-sm text-gray-500 line-through mr-2">
                    {course.originalPrice}€
                  </span>
                )}
                <span className="text-2xl font-bold text-green-600">
                  {course.price}€
                </span>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                -{Math.round((1 - course.price / (course.originalPrice || course.price)) * 100)}%
              </Badge>
            </div>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
              S'inscrire maintenant
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
